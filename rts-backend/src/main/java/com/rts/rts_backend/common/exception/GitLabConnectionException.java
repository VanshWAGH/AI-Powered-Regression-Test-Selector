package com.rts.rts_backend.common.exception;

/**
 * Thrown when the backend cannot communicate with GitLab
 * or when GitLab returns an authentication/authorization error.
 * Handled by {@link GlobalExceptionHandler} to return HTTP 502.
 */
public class GitLabConnectionException extends RuntimeException {

    public GitLabConnectionException(String message) {
        super(message);
    }

    public GitLabConnectionException(String message, Throwable cause) {
        super(message, cause);
    }
}
