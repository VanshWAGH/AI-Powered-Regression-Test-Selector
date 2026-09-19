-- V5: Coverage data tables

CREATE TABLE coverage_reports (
    id                  UUID PRIMARY KEY,
    repository_id       UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    commit_sha          VARCHAR(40) NOT NULL,
    line_coverage_pct   DOUBLE PRECISION,
    branch_coverage_pct DOUBLE PRECISION,
    total_lines         INTEGER,
    covered_lines       INTEGER,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coverage_details (
    id                  UUID PRIMARY KEY,
    coverage_report_id  UUID NOT NULL REFERENCES coverage_reports(id) ON DELETE CASCADE,
    class_name          VARCHAR(500) NOT NULL,
    method_name         VARCHAR(500),
    line_start          INTEGER,
    line_end            INTEGER,
    covered             BOOLEAN NOT NULL DEFAULT FALSE,
    hit_count           INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_coverage_details_class ON coverage_details (coverage_report_id, class_name);
CREATE INDEX idx_coverage_reports_repo ON coverage_reports (repository_id, commit_sha);
