package com.rts.rts_backend.repository.model;

/**
 * Status of the GitLab connection for a registered repository.
 */
public enum ConnectionStatus {
    /** Initial state — never validated. */
    PENDING,

    /** Last validation succeeded — all permissions confirmed. */
    CONNECTED,

    /** Last validation failed — token expired, project not found, or permission denied. */
    FAILED,

    /** Explicitly disconnected by user. */
    DISCONNECTED
}
