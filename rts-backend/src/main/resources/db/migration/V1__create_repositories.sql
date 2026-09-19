-- V1: Core repositories table for registered GitLab projects

CREATE TABLE repositories (
    id                      UUID PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    gitlab_base_url         VARCHAR(512) NOT NULL,
    gitlab_project_id       BIGINT NOT NULL,
    gitlab_project_path     VARCHAR(512),
    default_branch          VARCHAR(255) DEFAULT 'main',
    build_system            VARCHAR(20)  NOT NULL,
    test_framework          VARCHAR(20)  DEFAULT 'JUNIT5',
    access_token_encrypted  BYTEA,
    webhook_secret_hash     VARCHAR(128),
    connection_status       VARCHAR(20)  DEFAULT 'PENDING',
    last_synced_at          TIMESTAMPTZ,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_repositories_gitlab UNIQUE (gitlab_base_url, gitlab_project_id)
);

CREATE INDEX idx_repositories_connection_status ON repositories (connection_status);
CREATE INDEX idx_repositories_gitlab_project_id ON repositories (gitlab_project_id);
