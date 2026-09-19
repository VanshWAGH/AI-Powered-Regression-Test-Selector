package com.rts.rts_backend.repository.service;

import com.rts.rts_backend.common.exception.GitLabConnectionException;
import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.common.util.IdGenerator;
import com.rts.rts_backend.common.util.TimeUtils;
import com.rts.rts_backend.config.TokenEncryptionService;
import com.rts.rts_backend.gitlab.client.GitLabClient;
import com.rts.rts_backend.gitlab.model.GitLabProject;
import com.rts.rts_backend.repository.dao.RepositoryDao;
import com.rts.rts_backend.repository.dto.CreateRepositoryRequest;
import com.rts.rts_backend.repository.dto.RepositoryResponse;
import com.rts.rts_backend.repository.dto.UpdateRepositoryRequest;
import com.rts.rts_backend.repository.dto.ValidationResult;
import com.rts.rts_backend.repository.model.ConnectionStatus;
import com.rts.rts_backend.repository.model.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Default implementation of {@link RepositoryService}.
 *
 * <p>Handles repository CRUD, GitLab token encryption, connection
 * validation, and metadata synchronisation.
 */
@Service
public class RepositoryServiceImpl implements RepositoryService {

    private static final Logger log = LoggerFactory.getLogger(RepositoryServiceImpl.class);

    private final RepositoryDao repositoryDao;
    private final GitLabClient gitLabClient;
    private final TokenEncryptionService tokenEncryption;

    public RepositoryServiceImpl(RepositoryDao repositoryDao,
                                  GitLabClient gitLabClient,
                                  TokenEncryptionService tokenEncryption) {
        this.repositoryDao = repositoryDao;
        this.gitLabClient = gitLabClient;
        this.tokenEncryption = tokenEncryption;
    }

    // ---- CRUD ----

    @Override
    @Transactional
    public RepositoryResponse create(CreateRepositoryRequest request) {
        // Check for duplicate registration
        if (repositoryDao.existsByGitlabProject(request.gitlabBaseUrl(), request.gitlabProjectId())) {
            throw new IllegalArgumentException(
                    "Repository already registered: " + request.gitlabBaseUrl() +
                    " / project " + request.gitlabProjectId());
        }

        Instant now = TimeUtils.now();
        Repository repo = new Repository();
        repo.setId(IdGenerator.newId());
        repo.setName(request.name());
        repo.setGitlabBaseUrl(normalizeUrl(request.gitlabBaseUrl()));
        repo.setGitlabProjectId(request.gitlabProjectId());
        repo.setDefaultBranch("main");
        repo.setBuildSystem(request.buildSystem());
        repo.setTestFramework("JUNIT5");
        repo.setAccessTokenEncrypted(tokenEncryption.encrypt(request.accessToken()));
        repo.setWebhookSecretHash(request.webhookSecret() != null ? hashSecret(request.webhookSecret()) : null);
        repo.setConnectionStatus(ConnectionStatus.PENDING);
        repo.setCreatedAt(now);
        repo.setUpdatedAt(now);

        repositoryDao.insert(repo);
        log.info("Repository created: id={}, name={}, gitlabProjectId={}",
                repo.getId(), repo.getName(), repo.getGitlabProjectId());

        return RepositoryResponse.from(repo);
    }

    @Override
    public RepositoryResponse getById(UUID id) {
        Repository repo = findOrThrow(id);
        return RepositoryResponse.from(repo);
    }

    @Override
    public List<RepositoryResponse> getAll() {
        return repositoryDao.findAll().stream()
                .map(RepositoryResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public RepositoryResponse update(UUID id, UpdateRepositoryRequest request) {
        Repository repo = findOrThrow(id);

        if (request.name() != null) {
            repo.setName(request.name());
        }
        if (request.gitlabBaseUrl() != null) {
            repo.setGitlabBaseUrl(normalizeUrl(request.gitlabBaseUrl()));
        }
        if (request.gitlabProjectId() != null) {
            repo.setGitlabProjectId(request.gitlabProjectId());
        }
        if (request.accessToken() != null) {
            repo.setAccessTokenEncrypted(tokenEncryption.encrypt(request.accessToken()));
            repo.setConnectionStatus(ConnectionStatus.PENDING);
        }
        if (request.buildSystem() != null) {
            repo.setBuildSystem(request.buildSystem());
        }
        if (request.webhookSecret() != null) {
            repo.setWebhookSecretHash(hashSecret(request.webhookSecret()));
        }

        repo.setUpdatedAt(TimeUtils.now());
        repositoryDao.update(repo);
        log.info("Repository updated: id={}", id);

        return RepositoryResponse.from(repo);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repositoryDao.deleteById(id)) {
            throw new ResourceNotFoundException("Repository", id.toString());
        }
        log.info("Repository deleted: id={}", id);
    }

    // ---- Validation ----

    @Override
    @Transactional
    public ValidationResult validate(UUID id) {
        Repository repo = findOrThrow(id);
        String accessToken = tokenEncryption.decrypt(repo.getAccessTokenEncrypted());

        try {
            // Step 1: Fetch project metadata (verifies base URL, project ID, and token)
            GitLabProject project = gitLabClient.getProject(
                    repo.getGitlabBaseUrl(), accessToken, repo.getGitlabProjectId());

            // Step 2: Check granular permissions
            boolean repoRead = gitLabClient.canReadRepository(
                    repo.getGitlabBaseUrl(), accessToken, repo.getGitlabProjectId());
            boolean mrRead = gitLabClient.canReadMergeRequests(
                    repo.getGitlabBaseUrl(), accessToken, repo.getGitlabProjectId());
            boolean pipelineRead = gitLabClient.canReadPipelines(
                    repo.getGitlabBaseUrl(), accessToken, repo.getGitlabProjectId());
            boolean artifactRead = gitLabClient.canReadArtifacts(
                    repo.getGitlabBaseUrl(), accessToken, repo.getGitlabProjectId());

            // Step 3: Update repository metadata from GitLab
            repo.setGitlabProjectPath(project.pathWithNamespace());
            repo.setDefaultBranch(project.defaultBranch() != null ? project.defaultBranch() : "main");
            repo.setConnectionStatus(ConnectionStatus.CONNECTED);
            repo.setLastSyncedAt(TimeUtils.now());
            repo.setUpdatedAt(TimeUtils.now());
            repositoryDao.update(repo);

            log.info("Repository validated: id={}, project={}", id, project.name());

            ValidationResult.Permissions perms = new ValidationResult.Permissions(
                    repoRead, mrRead, pipelineRead, artifactRead);
            return ValidationResult.success(project.name(), project.defaultBranch(), perms);

        } catch (GitLabConnectionException e) {
            repo.setConnectionStatus(ConnectionStatus.FAILED);
            repo.setUpdatedAt(TimeUtils.now());
            repositoryDao.update(repo);

            log.warn("Repository validation failed: id={}, error={}", id, e.getMessage());
            return ValidationResult.failure(e.getMessage());
        }
    }

    // ---- Sync ----

    @Override
    @Transactional
    public RepositoryResponse sync(UUID id) {
        Repository repo = findOrThrow(id);
        String accessToken = tokenEncryption.decrypt(repo.getAccessTokenEncrypted());

        GitLabProject project = gitLabClient.getProject(
                repo.getGitlabBaseUrl(), accessToken, repo.getGitlabProjectId());

        repo.setName(project.name());
        repo.setGitlabProjectPath(project.pathWithNamespace());
        repo.setDefaultBranch(project.defaultBranch() != null ? project.defaultBranch() : "main");
        repo.setLastSyncedAt(TimeUtils.now());
        repo.setUpdatedAt(TimeUtils.now());
        repositoryDao.update(repo);

        log.info("Repository synced from GitLab: id={}, name={}", id, project.name());
        return RepositoryResponse.from(repo);
    }

    // ---- Helpers ----

    private Repository findOrThrow(UUID id) {
        return repositoryDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", id.toString()));
    }

    private static String normalizeUrl(String url) {
        return url != null ? url.replaceAll("/+$", "") : null;
    }

    /**
     * Hash a webhook secret for storage. Uses a simple SHA-256 for v1.
     * In production, consider bcrypt or Argon2 for timing-attack resistance.
     */
    private static String hashSecret(String secret) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash webhook secret", e);
        }
    }
}
