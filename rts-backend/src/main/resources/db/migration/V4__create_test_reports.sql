-- V4: Test reports table

CREATE TABLE test_reports (
    id                  UUID PRIMARY KEY,
    repository_id       UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    commit_sha          VARCHAR(40) NOT NULL,
    class_name          VARCHAR(500) NOT NULL,
    method_name         VARCHAR(500) NOT NULL,
    status              VARCHAR(20) NOT NULL,
    duration_ms         BIGINT NOT NULL,
    failure_message     TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying test history by class/method for recommendation
CREATE INDEX idx_test_reports_history ON test_reports (repository_id, class_name, method_name, status);
