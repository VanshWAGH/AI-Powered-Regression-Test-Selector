package com.rts.rts_backend.repository.dto;

import com.rts.rts_backend.repository.model.BuildSystem;
import com.rts.rts_backend.repository.model.ConnectionStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Response body for repository endpoints.
 * <strong>Never</strong> includes the access token or webhook secret.
 */
public record RepositoryResponse(
        UUID id,
        String name,
        String gitlabBaseUrl,
        Long gitlabProjectId,
        String gitlabProjectPath,
        String defaultBranch,
        BuildSystem buildSystem,
        String testFramework,
        ConnectionStatus connectionStatus,
        Instant lastSyncedAt,
        Instant createdAt,
        Instant updatedAt
) {
    /**
     * Map a domain {@link com.rts.rts_backend.repository.model.Repository} to a response DTO.
     */
    public static RepositoryResponse from(com.rts.rts_backend.repository.model.Repository repo) {
        return new RepositoryResponse(
                repo.getId(),
                repo.getName(),
                repo.getGitlabBaseUrl(),
                repo.getGitlabProjectId(),
                repo.getGitlabProjectPath(),
                repo.getDefaultBranch(),
                repo.getBuildSystem(),
                repo.getTestFramework(),
                repo.getConnectionStatus(),
                repo.getLastSyncedAt(),
                repo.getCreatedAt(),
                repo.getUpdatedAt()
        );
    }
}
