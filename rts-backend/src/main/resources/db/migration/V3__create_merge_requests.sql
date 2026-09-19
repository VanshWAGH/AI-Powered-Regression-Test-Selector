-- V3: Merge requests table

CREATE TABLE merge_requests (
    id                  UUID PRIMARY KEY,
    repository_id       UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    gitlab_iid          INTEGER NOT NULL,
    title               VARCHAR(1000),
    source_branch       VARCHAR(255) NOT NULL,
    target_branch       VARCHAR(255) NOT NULL,
    source_commit_sha   VARCHAR(40),
    target_commit_sha   VARCHAR(40),
    author_username     VARCHAR(255),
    state               VARCHAR(20) NOT NULL,
    web_url             VARCHAR(1024),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_merge_requests_gitlab UNIQUE (repository_id, gitlab_iid)
);

CREATE INDEX idx_merge_requests_repo_state ON merge_requests (repository_id, state);
