package com.rts.rts_backend.gitlab.client;

import com.rts.rts_backend.gitlab.model.GitLabProject;

/**
 * Abstraction over the GitLab REST API v4.
 *
 * <p>Each method accepts the GitLab base URL and access token so the
 * backend can talk to multiple GitLab instances (one per repository).
 */
public interface GitLabClient {

    /**
     * Fetch project metadata.
     *
     * @throws com.rts.rts_backend.common.exception.GitLabConnectionException on connectivity or auth errors
     */
    GitLabProject getProject(String baseUrl, String accessToken, Long projectId);

    /**
     * Check if the token has read access to the repository.
     */
    boolean canReadRepository(String baseUrl, String accessToken, Long projectId);

    /**
     * Check if the token has read access to merge requests.
     */
    boolean canReadMergeRequests(String baseUrl, String accessToken, Long projectId);

    /**
     * Check if the token has read access to pipelines.
     */
    boolean canReadPipelines(String baseUrl, String accessToken, Long projectId);

    /**
     * Check if the token has read access to job artifacts.
     */
    boolean canReadArtifacts(String baseUrl, String accessToken, Long projectId);
}
