-- V6: Pipeline and job tracking

CREATE TABLE pipeline_runs (
    id                  UUID PRIMARY KEY,
    repository_id       UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    merge_request_id    UUID REFERENCES merge_requests(id) ON DELETE SET NULL,
    gitlab_pipeline_id  BIGINT NOT NULL,
    commit_sha          VARCHAR(40) NOT NULL,
    status              VARCHAR(30) NOT NULL,
    source              VARCHAR(50),
    used_recommendation BOOLEAN NOT NULL DEFAULT FALSE,
    total_tests         INTEGER,
    selected_tests      INTEGER,
    duration_seconds    INTEGER,
    web_url             VARCHAR(1024),
    started_at          TIMESTAMPTZ,
    finished_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pipeline_runs_repo ON pipeline_runs (repository_id, created_at DESC);
CREATE INDEX idx_pipeline_runs_mr ON pipeline_runs (merge_request_id);

-- Evaluation metrics per recommendation
CREATE TABLE recommendation_evaluations (
    id                      UUID PRIMARY KEY,
    pipeline_run_id         UUID NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
    repository_id           UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    total_tests             INTEGER NOT NULL,
    selected_tests          INTEGER NOT NULL,
    missed_failures         INTEGER NOT NULL DEFAULT 0,
    caught_failures         INTEGER NOT NULL DEFAULT 0,
    recall_pct              DOUBLE PRECISION,
    precision_pct           DOUBLE PRECISION,
    time_saved_seconds      INTEGER,
    time_saved_pct          DOUBLE PRECISION,
    evaluated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evaluations_repo ON recommendation_evaluations (repository_id, evaluated_at DESC);
