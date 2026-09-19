package com.rts.rts_backend.repository.dto;

/**
 * Result of a GitLab connection validation — returned by
 * {@code POST /api/v1/repositories/{id}/validate}.
 *
 * @param connected       true if overall connection is healthy
 * @param projectName     GitLab project name (null if connection failed)
 * @param defaultBranch   default branch from GitLab (null if connection failed)
 * @param permissions     granular permission check results
 * @param errorMessage    explanation when connected == false
 */
public record ValidationResult(
        boolean connected,
        String projectName,
        String defaultBranch,
        Permissions permissions,
        String errorMessage
) {

    public record Permissions(
            boolean repositoryRead,
            boolean mergeRequestRead,
            boolean pipelineRead,
            boolean artifactRead
    ) {
        public static Permissions allGranted() {
            return new Permissions(true, true, true, true);
        }

        public static Permissions none() {
            return new Permissions(false, false, false, false);
        }
    }

    public static ValidationResult success(String projectName, String defaultBranch,
                                            Permissions permissions) {
        return new ValidationResult(true, projectName, defaultBranch, permissions, null);
    }

    public static ValidationResult failure(String errorMessage) {
        return new ValidationResult(false, null, null, Permissions.none(), errorMessage);
    }
}
