package com.rts.rts_backend.gitlab.webhook;

import com.rts.rts_backend.common.exception.DuplicateEventException;
import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.common.util.IdGenerator;
import com.rts.rts_backend.common.util.TimeUtils;
import com.rts.rts_backend.gitlab.dao.GitLabEventDao;
import com.rts.rts_backend.gitlab.model.GitLabMergeRequestEvent;
import com.rts.rts_backend.mergerequest.dao.MergeRequestDao;
import com.rts.rts_backend.mergerequest.model.MergeRequest;
import com.rts.rts_backend.mergerequest.model.MergeRequestState;
import com.rts.rts_backend.repository.dao.RepositoryDao;
import com.rts.rts_backend.repository.model.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class WebhookServiceImpl implements WebhookService {

    private static final Logger log = LoggerFactory.getLogger(WebhookServiceImpl.class);

    private final RepositoryDao repositoryDao;
    private final GitLabEventDao gitLabEventDao;
    private final MergeRequestDao mergeRequestDao;

    public WebhookServiceImpl(RepositoryDao repositoryDao, GitLabEventDao gitLabEventDao, MergeRequestDao mergeRequestDao) {
        this.repositoryDao = repositoryDao;
        this.gitLabEventDao = gitLabEventDao;
        this.mergeRequestDao = mergeRequestDao;
    }

    @Override
    @Transactional
    public void processMergeRequestEvent(UUID repositoryId, String gitlabToken, String eventId, String payloadJson, GitLabMergeRequestEvent event) {
        Repository repo = repositoryDao.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", repositoryId.toString()));

        // Validate secret token if the repository has one configured
        if (repo.getWebhookSecretHash() != null) {
            if (gitlabToken == null || !verifySecret(gitlabToken, repo.getWebhookSecretHash())) {
                throw new IllegalArgumentException("Invalid or missing X-Gitlab-Token header");
            }
        }

        // Deduplicate using GitLabEventDao
        try {
            gitLabEventDao.insertEvent(repositoryId, eventId, "merge_request", payloadJson);
        } catch (DataIntegrityViolationException e) {
            log.info("Duplicate webhook event ignored: repo={}, eventId={}", repositoryId, eventId);
            throw new DuplicateEventException("Duplicate event: " + eventId);
        }

        GitLabMergeRequestEvent.ObjectAttributes attrs = event.objectAttributes();
        if (attrs == null) {
            log.warn("Ignoring MR event with missing object_attributes");
            return;
        }

        // Map state
        MergeRequestState state;
        try {
            state = MergeRequestState.valueOf(attrs.state().toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Unknown MR state '{}', defaulting to OPENED", attrs.state());
            state = MergeRequestState.OPENED;
        }

        Instant now = TimeUtils.now();
        Optional<MergeRequest> existingMr = mergeRequestDao.findByRepositoryIdAndGitlabIid(repositoryId, attrs.iid());

        if (existingMr.isPresent()) {
            MergeRequest mr = existingMr.get();
            mr.setTitle(attrs.title());
            mr.setSourceBranch(attrs.sourceBranch());
            mr.setTargetBranch(attrs.targetBranch());
            if (attrs.lastCommit() != null) {
                mr.setSourceCommitSha(attrs.lastCommit().id());
            }
            mr.setState(state);
            mr.setUpdatedAt(now);
            mergeRequestDao.update(mr);
            log.info("Updated MergeRequest id={}, iid={}", mr.getId(), attrs.iid());
        } else {
            MergeRequest mr = new MergeRequest();
            mr.setId(IdGenerator.newId());
            mr.setRepositoryId(repositoryId);
            mr.setGitlabIid(attrs.iid());
            mr.setTitle(attrs.title());
            mr.setSourceBranch(attrs.sourceBranch());
            mr.setTargetBranch(attrs.targetBranch());
            if (attrs.lastCommit() != null) {
                mr.setSourceCommitSha(attrs.lastCommit().id());
            }
            mr.setAuthorUsername("unknown"); // Usually fetched from event.user() if present
            mr.setState(state);
            mr.setWebUrl(attrs.url());
            mr.setCreatedAt(now);
            mr.setUpdatedAt(now);
            mergeRequestDao.insert(mr);
            log.info("Inserted MergeRequest id={}, iid={}", mr.getId(), attrs.iid());
        }
    }

    private boolean verifySecret(String rawToken, String storedHash) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            String hexHash = java.util.HexFormat.of().formatHex(hash);
            // Constant-time compare is best, but for v1 this is okay
            return java.security.MessageDigest.isEqual(hexHash.getBytes(), storedHash.getBytes());
        } catch (Exception e) {
            return false;
        }
    }
}
