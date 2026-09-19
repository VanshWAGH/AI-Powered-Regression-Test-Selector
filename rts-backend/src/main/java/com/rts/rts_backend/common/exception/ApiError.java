package com.rts.rts_backend.common.exception;

import java.time.Instant;
import java.util.List;

/**
 * Uniform error response body returned by all API error responses.
 *
 * <p>Example JSON:
 * <pre>{@code
 * {
 *   "requestId": "abc-123",
 *   "status": 404,
 *   "code": "NOT_FOUND",
 *   "message": "Repository not found: ...",
 *   "details": [],
 *   "timestamp": "2026-09-18T14:00:00Z"
 * }
 * }</pre>
 */
public record ApiError(
        String requestId,
        int status,
        String code,
        String message,
        List<FieldError> details,
        Instant timestamp
) {

    /**
     * Represents a single field-level validation error.
     */
    public record FieldError(String field, String message) {}

    public static ApiError of(String requestId, int status, String code, String message) {
        return new ApiError(requestId, status, code, message, List.of(), Instant.now());
    }

    public static ApiError of(String requestId, int status, String code, String message,
                               List<FieldError> details) {
        return new ApiError(requestId, status, code, message, details, Instant.now());
    }
}
