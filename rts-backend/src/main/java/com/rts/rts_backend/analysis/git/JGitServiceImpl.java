package com.rts.rts_backend.analysis.git;

import com.rts.rts_backend.analysis.model.ChangedFile;
import com.rts.rts_backend.analysis.model.GitDiffResult;
import com.rts.rts_backend.config.TokenEncryptionService;
import com.rts.rts_backend.repository.model.Repository;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectReader;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.eclipse.jgit.treewalk.AbstractTreeIterator;
import org.eclipse.jgit.treewalk.CanonicalTreeParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class JGitServiceImpl implements GitService {

    private static final Logger log = LoggerFactory.getLogger(JGitServiceImpl.class);

    private final String workspaceDir;
    private final TokenEncryptionService tokenEncryption;

    public JGitServiceImpl(
            @Value("${rts.analysis.workspace-dir:/tmp/rts-workspaces}") String workspaceDir,
            TokenEncryptionService tokenEncryption) {
        this.workspaceDir = workspaceDir;
        this.tokenEncryption = tokenEncryption;
    }

    @Override
    public void ensureRepository(Repository repository) {
        File repoDir = getRepoDir(repository);
        String token = tokenEncryption.decrypt(repository.getAccessTokenEncrypted());
        
        // Construct GitLab clone URL. Assuming oauth2 token usage for HTTP clone
        String cloneUrl = buildCloneUrl(repository.getGitlabBaseUrl(), repository.getGitlabProjectPath());
        
        UsernamePasswordCredentialsProvider credentials = 
                new UsernamePasswordCredentialsProvider("oauth2", token);

        try {
            if (repoDir.exists() && new File(repoDir, ".git").exists()) {
                log.info("Fetching existing repository for {}", repository.getId());
                try (Git git = Git.open(repoDir)) {
                    git.fetch()
                       .setCredentialsProvider(credentials)
                       .call();
                }
            } else {
                log.info("Cloning repository for {} to {}", repository.getId(), repoDir.getAbsolutePath());
                Git.cloneRepository()
                   .setURI(cloneUrl)
                   .setDirectory(repoDir)
                   .setCredentialsProvider(credentials)
                   .call()
                   .close();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to clone or fetch repository: " + repository.getId(), e);
        }
    }

    @Override
    public GitDiffResult calculateDiff(Repository repository, String baseCommit, String headCommit) {
        File repoDir = getRepoDir(repository);
        if (!repoDir.exists()) {
            throw new IllegalStateException("Repository not found locally: " + repoDir.getAbsolutePath());
        }

        try (Git git = Git.open(repoDir)) {
            org.eclipse.jgit.lib.Repository jgitRepo = git.getRepository();

            ObjectId baseId = jgitRepo.resolve(baseCommit);
            ObjectId headId = jgitRepo.resolve(headCommit);

            if (baseId == null) throw new IllegalArgumentException("Base commit not found: " + baseCommit);
            if (headId == null) throw new IllegalArgumentException("Head commit not found: " + headCommit);

            List<ChangedFile> changedFiles = new ArrayList<>();

            try (ObjectReader reader = jgitRepo.newObjectReader();
                 RevWalk walk = new RevWalk(jgitRepo);
                 ByteArrayOutputStream out = new ByteArrayOutputStream();
                 DiffFormatter df = new DiffFormatter(out)) {

                RevCommit baseRev = walk.parseCommit(baseId);
                RevCommit headRev = walk.parseCommit(headId);

                AbstractTreeIterator baseTreeIter = new CanonicalTreeParser(null, reader, baseRev.getTree());
                AbstractTreeIterator headTreeIter = new CanonicalTreeParser(null, reader, headRev.getTree());

                df.setRepository(jgitRepo);
                List<DiffEntry> diffs = df.scan(baseTreeIter, headTreeIter);

                for (DiffEntry entry : diffs) {
                    out.reset();
                    df.format(entry);
                    String patch = out.toString(StandardCharsets.UTF_8);

                    ChangedFile.ChangeType type = mapChangeType(entry.getChangeType());
                    changedFiles.add(new ChangedFile(entry.getOldPath(), entry.getNewPath(), type, patch));
                }
            }

            log.info("Calculated diff between {} and {}, found {} changed files", baseCommit, headCommit, changedFiles.size());
            return new GitDiffResult(baseCommit, headCommit, changedFiles);

        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate diff for repo " + repository.getId(), e);
        }
    }

    @Override
    public void checkoutCommit(Repository repository, String commitSha) {
        File repoDir = getRepoDir(repository);
        if (!repoDir.exists()) {
            throw new IllegalStateException("Repository not found locally: " + repoDir.getAbsolutePath());
        }

        try (Git git = Git.open(repoDir)) {
            git.checkout()
               .setName(commitSha)
               .call();
            log.info("Checked out commit {} for repo {}", commitSha, repository.getId());
        } catch (Exception e) {
            throw new RuntimeException("Failed to checkout commit " + commitSha + " for repo " + repository.getId(), e);
        }
    }

    private File getRepoDir(Repository repository) {
        return new File(workspaceDir, repository.getId().toString());
    }

    private String buildCloneUrl(String baseUrl, String projectPath) {
        return baseUrl + "/" + projectPath + ".git";
    }

    private ChangedFile.ChangeType mapChangeType(DiffEntry.ChangeType jgitType) {
        return switch (jgitType) {
            case ADD -> ChangedFile.ChangeType.ADD;
            case MODIFY -> ChangedFile.ChangeType.MODIFY;
            case DELETE -> ChangedFile.ChangeType.DELETE;
            case RENAME -> ChangedFile.ChangeType.RENAME;
            case COPY -> ChangedFile.ChangeType.COPY;
        };
    }
}
