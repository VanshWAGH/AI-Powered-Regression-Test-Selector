package com.rts.rts_backend.common.util;

import java.util.UUID;

/**
 * Centralised ID generator. Currently produces random UUIDs (v4).
 * Can be swapped to UUIDv7 (time-sortable) for better DB index locality.
 */
public final class IdGenerator {

    private IdGenerator() {
        // utility class
    }

    /**
     * Generate a new random UUID for use as a primary key.
     */
    public static UUID newId() {
        return UUID.randomUUID();
    }
}
