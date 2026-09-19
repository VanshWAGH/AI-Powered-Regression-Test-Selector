-- V2: GitLab webhook event tracking and deduplication

CREATE TABLE gitlab_events (
    id              UUID PRIMARY KEY,
    repository_id   UUID         NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    event_type      VARCHAR(50)  NOT NULL,
    event_key       VARCHAR(255) NOT NULL,
    payload_hash    VARCHAR(64),
    received_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    processed_at    TIMESTAMPTZ,
    status          VARCHAR(20)  DEFAULT 'RECEIVED',
    failure_reason  TEXT,

    CONSTRAINT uq_gitlab_events_dedup UNIQUE (repository_id, event_key, payload_hash)
);

CREATE INDEX idx_gitlab_events_repo_status ON gitlab_events (repository_id, status);
CREATE INDEX idx_gitlab_events_received_at ON gitlab_events (received_at);
