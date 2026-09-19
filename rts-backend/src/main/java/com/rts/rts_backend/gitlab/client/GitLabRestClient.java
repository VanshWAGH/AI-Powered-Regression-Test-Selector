package com.rts.rts_backend.gitlab.client;

import com.rts.rts_backend.common.exception.GitLabConnectionException;
import com.rts.rts_backend.gitlab.model.GitLabProject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * {@link GitLabClient} implementation using Spring's {@link RestClient}.
 *
 * <p>Each call dynamically targets the given {@code baseUrl} so the
 * backend can manage repositories from different GitLab instances.
 */
@Component
public class GitLabRestClient implements GitLabClient {

    private static final Logger log = LoggerFactory.getLogger(GitLabRestClient.class);
    private static final String API_V4 = "/api/v4";
    private static final String TOKEN_HEADER = "PRIVATE-TOKEN";

    private final RestClient restClient;

    public GitLabRestClient(
            @Value("${rts.gitlab.connect-timeout-ms:5000}") int connectTimeoutMs,
            @Value("${rts.gitlab.read-timeout-ms:10000}") int readTimeoutMs) {

        this.restClient = RestClient.builder()
                .defaultHeader("Accept", "application/json")
                .build();
    }

    // ---- Public API ----

    @Override
    public GitLabProject getProject(String baseUrl, String accessToken, Long projectId) {
        String url = baseUrl + API_V4 + "/projects/" + projectId;
        log.debug("Fetching GitLab project: {}", url);

        try {
            return restClient.get()
                    .uri(url)
                    .header(TOKEN_HEADER, accessToken)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                        throw new GitLabConnectionException(
                                "GitLab returned " + res.getStatusCode() +
                                " for project " + projectId);
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                        throw new GitLabConnectionException(
                                "GitLab server error: " + res.getStatusCode());
                    })
                    .body(GitLabProject.class);
        } catch (GitLabConnectionException e) {
            throw e;
        } catch (Exception e) {
            throw new GitLabConnectionException(
                    "Failed to connect to GitLab at " + baseUrl + ": " + e.getMessage(), e);
        }
    }

    @Override
    public boolean canReadRepository(String baseUrl, String accessToken, Long projectId) {
        return probeEndpoint(baseUrl, accessToken,
                "/projects/" + projectId + "/repository/branches?per_page=1");
    }

    @Override
    public boolean canReadMergeRequests(String baseUrl, String accessToken, Long projectId) {
        return probeEndpoint(baseUrl, accessToken,
                "/projects/" + projectId + "/merge_requests?per_page=1&state=all");
    }

    @Override
    public boolean canReadPipelines(String baseUrl, String accessToken, Long projectId) {
        return probeEndpoint(baseUrl, accessToken,
                "/projects/" + projectId + "/pipelines?per_page=1");
    }

    @Override
    public boolean canReadArtifacts(String baseUrl, String accessToken, Long projectId) {
        // Probe jobs endpoint — if the token can list jobs, it can also read artifacts.
        return probeEndpoint(baseUrl, accessToken,
                "/projects/" + projectId + "/jobs?per_page=1");
    }

    // ---- Helpers ----

    /**
     * Probe a GitLab API endpoint to check if the token grants read access.
     * Returns {@code true} on 2xx, {@code false} on 4xx/5xx.
     */
    private boolean probeEndpoint(String baseUrl, String accessToken, String path) {
        String url = baseUrl + API_V4 + path;
        log.debug("Probing GitLab endpoint: {}", url);

        try {
            restClient.get()
                    .uri(url)
                    .header(TOKEN_HEADER, accessToken)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (Exception e) {
            log.debug("Probe failed for {}: {}", path, e.getMessage());
            return false;
        }
    }
}
