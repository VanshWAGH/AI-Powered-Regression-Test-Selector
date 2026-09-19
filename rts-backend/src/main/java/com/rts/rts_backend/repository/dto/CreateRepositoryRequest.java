package com.rts.rts_backend.repository.dto;

import com.rts.rts_backend.repository.model.BuildSystem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Request body for {@code POST /api/v1/repositories} — register a new GitLab project.
 *
 * @param name            Human-readable project name (e.g., "orders-service")
 * @param gitlabBaseUrl   GitLab instance URL (e.g., "https://gitlab.com")
 * @param gitlabProjectId GitLab numeric project ID
 * @param accessToken     GitLab personal/project access token (stored encrypted, never returned)
 * @param buildSystem     MAVEN or GRADLE
 * @param webhookSecret   Optional secret for webhook verification
 */
public record CreateRepositoryRequest(

        @NotBlank(message = "Project name is required")
        String name,

        @NotBlank(message = "GitLab base URL is required")
        String gitlabBaseUrl,

        @NotNull(message = "GitLab project ID is required")
        @Positive(message = "GitLab project ID must be positive")
        Long gitlabProjectId,

        @NotBlank(message = "Access token is required")
        String accessToken,

        @NotNull(message = "Build system is required")
        BuildSystem buildSystem,

        String webhookSecret
) {}
