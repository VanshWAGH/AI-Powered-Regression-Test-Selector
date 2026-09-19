package com.rts.rts_backend.common.web;

import java.time.Instant;

/**
 * Uniform success response envelope for all REST endpoints.
 *
 * <p>Example JSON:
 * <pre>{@code
 * {
 *   "data": { ... },
 *   "meta": {
 *     "requestId": "abc-123",
 *     "timestamp": "2026-09-18T14:00:00Z",
 *     "nextCursor": null
 *   }
 * }
 * }</pre>
 *
 * @param <T> the type of the response payload
 */
public record ApiResponse<T>(T data, Meta meta) {

    public record Meta(
            String requestId,
            Instant timestamp,
            String nextCursor,
            Integer totalCount
    ) {}

    /** Wrap a single result. */
    public static <T> ApiResponse<T> of(T data, String requestId) {
        return new ApiResponse<>(data, new Meta(requestId, Instant.now(), null, null));
    }

    /** Wrap a paginated list result. */
    public static <T> ApiResponse<T> of(T data, String requestId, String nextCursor, Integer totalCount) {
        return new ApiResponse<>(data, new Meta(requestId, Instant.now(), nextCursor, totalCount));
    }
}
