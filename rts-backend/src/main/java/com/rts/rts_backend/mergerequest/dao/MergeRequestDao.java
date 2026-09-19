package com.rts.rts_backend.mergerequest.dao;

import com.rts.rts_backend.mergerequest.model.MergeRequest;
import com.rts.rts_backend.mergerequest.model.MergeRequestState;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class MergeRequestDao {

    private final JdbcClient jdbc;

    public MergeRequestDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<MergeRequest> ROW_MAPPER = (rs, rowNum) -> {
        MergeRequest mr = new MergeRequest();
        mr.setId(rs.getObject("id", UUID.class));
        mr.setRepositoryId(rs.getObject("repository_id", UUID.class));
        mr.setGitlabIid(rs.getInt("gitlab_iid"));
        mr.setTitle(rs.getString("title"));
        mr.setSourceBranch(rs.getString("source_branch"));
        mr.setTargetBranch(rs.getString("target_branch"));
        mr.setSourceCommitSha(rs.getString("source_commit_sha"));
        mr.setTargetCommitSha(rs.getString("target_commit_sha"));
        mr.setAuthorUsername(rs.getString("author_username"));
        mr.setState(MergeRequestState.valueOf(rs.getString("state")));
        mr.setWebUrl(rs.getString("web_url"));
        mr.setCreatedAt(toInstant(rs.getTimestamp("created_at")));
        mr.setUpdatedAt(toInstant(rs.getTimestamp("updated_at")));
        return mr;
    };

    public void insert(MergeRequest mr) {
        jdbc.sql("""
                INSERT INTO merge_requests (
                    id, repository_id, gitlab_iid, title, source_branch, target_branch,
                    source_commit_sha, target_commit_sha, author_username, state, web_url,
                    created_at, updated_at
                ) VALUES (
                    :id, :repoId, :iid, :title, :sourceBranch, :targetBranch,
                    :sourceSha, :targetSha, :author, :state, :webUrl,
                    :createdAt, :updatedAt
                )
                """)
                .param("id", mr.getId())
                .param("repoId", mr.getRepositoryId())
                .param("iid", mr.getGitlabIid())
                .param("title", mr.getTitle())
                .param("sourceBranch", mr.getSourceBranch())
                .param("targetBranch", mr.getTargetBranch())
                .param("sourceSha", mr.getSourceCommitSha())
                .param("targetSha", mr.getTargetCommitSha())
                .param("author", mr.getAuthorUsername())
                .param("state", mr.getState().name())
                .param("webUrl", mr.getWebUrl())
                .param("createdAt", toTimestamp(mr.getCreatedAt()))
                .param("updatedAt", toTimestamp(mr.getUpdatedAt()))
                .update();
    }

    public void update(MergeRequest mr) {
        jdbc.sql("""
                UPDATE merge_requests SET
                    title = :title,
                    source_branch = :sourceBranch,
                    target_branch = :targetBranch,
                    source_commit_sha = :sourceSha,
                    target_commit_sha = :targetSha,
                    author_username = :author,
                    state = :state,
                    web_url = :webUrl,
                    updated_at = :updatedAt
                WHERE id = :id
                """)
                .param("id", mr.getId())
                .param("title", mr.getTitle())
                .param("sourceBranch", mr.getSourceBranch())
                .param("targetBranch", mr.getTargetBranch())
                .param("sourceSha", mr.getSourceCommitSha())
                .param("targetSha", mr.getTargetCommitSha())
                .param("author", mr.getAuthorUsername())
                .param("state", mr.getState().name())
                .param("webUrl", mr.getWebUrl())
                .param("updatedAt", toTimestamp(mr.getUpdatedAt()))
                .update();
    }

    public Optional<MergeRequest> findById(UUID id) {
        return jdbc.sql("SELECT * FROM merge_requests WHERE id = :id")
                .param("id", id)
                .query(ROW_MAPPER)
                .optional();
    }

    public Optional<MergeRequest> findByRepositoryIdAndGitlabIid(UUID repositoryId, Integer gitlabIid) {
        return jdbc.sql("SELECT * FROM merge_requests WHERE repository_id = :repoId AND gitlab_iid = :iid")
                .param("repoId", repositoryId)
                .param("iid", gitlabIid)
                .query(ROW_MAPPER)
                .optional();
    }

    public List<MergeRequest> findByRepositoryId(UUID repositoryId) {
        return jdbc.sql("SELECT * FROM merge_requests WHERE repository_id = :repoId ORDER BY updated_at DESC")
                .param("repoId", repositoryId)
                .query(ROW_MAPPER)
                .list();
    }

    private static Instant toInstant(Timestamp ts) {
        return ts != null ? ts.toInstant() : null;
    }

    private static Timestamp toTimestamp(Instant instant) {
        return instant != null ? Timestamp.from(instant) : null;
    }
}
