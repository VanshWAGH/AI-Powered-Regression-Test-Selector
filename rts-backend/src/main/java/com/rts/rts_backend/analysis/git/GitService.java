package com.rts.rts_backend.analysis.git;

import com.rts.rts_backend.analysis.model.GitDiffResult;
import com.rts.rts_backend.repository.model.Repository;

/**
 * Service to manage local Git clones and calculate diffs.
 */
public interface GitService {
    
    /**
     * Clones or fetches the repository into a local workspace, ensuring the required commits are present.
     */
    void ensureRepository(Repository repository);

    /**
     * Calculate the diff between two commits.
     */
    GitDiffResult calculateDiff(Repository repository, String baseCommit, String headCommit);

    /**
     * Checkout a specific commit in the local workspace.
     */
    void checkoutCommit(Repository repository, String commitSha);
}
