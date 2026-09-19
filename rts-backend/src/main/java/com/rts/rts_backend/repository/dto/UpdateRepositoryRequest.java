package com.rts.rts_backend.repository.dto;

import com.rts.rts_backend.repository.model.BuildSystem;

/**
 * Request body for {@code PATCH /api/v1/repositories/{id}} — partial update.
 * All fields are optional; only non-null fields are applied.
 */
public record UpdateRepositoryRequest(
        String name,
        String gitlabBaseUrl,
        Long gitlabProjectId,
        String accessToken,
        BuildSystem buildSystem,
        String webhookSecret
) {}
