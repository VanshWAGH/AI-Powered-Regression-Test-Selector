package com.rts.rts_backend.gitlab.dao;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Handles database operations for gitlab_events (for idempotency and auditing).
 */
@Component
public class GitLabEventDao {

    private final JdbcClient jdbc;

    public GitLabEventDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Insert a new event. Throws a DataIntegrityViolationException if event_id already exists.
     * Use this for idempotency to ensure we don't process the same webhook twice.
     */
    public void insertEvent(UUID repositoryId, String eventId, String eventType, String payloadJson) {
        jdbc.sql("""
                INSERT INTO gitlab_events (
                    id, repository_id, event_id, event_type, payload, status, created_at
                ) VALUES (
                    gen_random_uuid(), :repositoryId, :eventId, :eventType, :payload::jsonb, 'PROCESSED', :createdAt
                )
                """)
                .param("repositoryId", repositoryId)
                .param("eventId", eventId)
                .param("eventType", eventType)
                .param("payload", payloadJson)
                .param("createdAt", java.sql.Timestamp.from(Instant.now()))
                .update();
    }
}
