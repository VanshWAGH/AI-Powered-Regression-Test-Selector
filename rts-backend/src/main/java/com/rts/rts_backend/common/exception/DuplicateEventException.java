package com.rts.rts_backend.common.exception;

/**
 * Thrown when a webhook event has already been processed (dedup check).
 * Handled by {@link GlobalExceptionHandler} to return HTTP 409 Conflict.
 */
public class DuplicateEventException extends RuntimeException {

    private final String eventKey;

    public DuplicateEventException(String eventKey) {
        super("Duplicate event: " + eventKey);
        this.eventKey = eventKey;
    }

    public String getEventKey() {
        return eventKey;
    }
}
