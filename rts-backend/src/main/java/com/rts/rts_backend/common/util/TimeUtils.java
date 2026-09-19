package com.rts.rts_backend.common.util;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

/**
 * Time utilities providing consistent timestamp handling across the application.
 */
public final class TimeUtils {

    private static final DateTimeFormatter ISO_FORMATTER =
            DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);

    private TimeUtils() {
        // utility class
    }

    /** Current UTC instant. */
    public static Instant now() {
        return Instant.now();
    }

    /** Format an instant as ISO-8601 string (e.g., "2026-09-18T14:00:00Z"). */
    public static String formatIso(Instant instant) {
        return instant != null ? ISO_FORMATTER.format(instant) : null;
    }
}
