package com.rts.rts_backend.pipeline.dao;

import com.rts.rts_backend.pipeline.model.PipelineRun;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class PipelineRunDao {

    private final JdbcClient jdbc;

    public PipelineRunDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<PipelineRun> ROW_MAPPER = (rs, rowNum) -> {
        PipelineRun p = new PipelineRun();
        p.setId(rs.getObject("id", UUID.class));
        p.setRepositoryId(rs.getObject("repository_id", UUID.class));
        p.setMergeRequestId(rs.getObject("merge_request_id", UUID.class));
        p.setGitlabPipelineId(rs.getLong("gitlab_pipeline_id"));
        p.setCommitSha(rs.getString("commit_sha"));
        p.setStatus(rs.getString("status"));
        p.setSource(rs.getString("source"));
        p.setUsedRecommendation(rs.getBoolean("used_recommendation"));
        p.setTotalTests(rs.getObject("total_tests", Integer.class));
        p.setSelectedTests(rs.getObject("selected_tests", Integer.class));
        p.setDurationSeconds(rs.getObject("duration_seconds", Integer.class));
        p.setWebUrl(rs.getString("web_url"));
        p.setStartedAt(toInstant(rs.getTimestamp("started_at")));
        p.setFinishedAt(toInstant(rs.getTimestamp("finished_at")));
        p.setCreatedAt(toInstant(rs.getTimestamp("created_at")));
        return p;
    };

    public void insert(PipelineRun run) {
        jdbc.sql("""
                INSERT INTO pipeline_runs (
                    id, repository_id, merge_request_id, gitlab_pipeline_id, commit_sha,
                    status, source, used_recommendation, total_tests, selected_tests,
                    duration_seconds, web_url, started_at, finished_at, created_at
                ) VALUES (
                    :id, :repoId, :mrId, :pipelineId, :commitSha,
                    :status, :source, :usedRec, :totalTests, :selectedTests,
                    :duration, :webUrl, :startedAt, :finishedAt, :createdAt
                )
                """)
                .param("id", run.getId())
                .param("repoId", run.getRepositoryId())
                .param("mrId", run.getMergeRequestId())
                .param("pipelineId", run.getGitlabPipelineId())
                .param("commitSha", run.getCommitSha())
                .param("status", run.getStatus())
                .param("source", run.getSource())
                .param("usedRec", run.isUsedRecommendation())
                .param("totalTests", run.getTotalTests())
                .param("selectedTests", run.getSelectedTests())
                .param("duration", run.getDurationSeconds())
                .param("webUrl", run.getWebUrl())
                .param("startedAt", toTimestamp(run.getStartedAt()))
                .param("finishedAt", toTimestamp(run.getFinishedAt()))
                .param("createdAt", toTimestamp(run.getCreatedAt()))
                .update();
    }

    public Optional<PipelineRun> findById(UUID id) {
        return jdbc.sql("SELECT * FROM pipeline_runs WHERE id = :id")
                .param("id", id)
                .query(ROW_MAPPER)
                .optional();
    }

    public List<PipelineRun> findByRepositoryId(UUID repositoryId) {
        return jdbc.sql("SELECT * FROM pipeline_runs WHERE repository_id = :repoId ORDER BY created_at DESC")
                .param("repoId", repositoryId)
                .query(ROW_MAPPER)
                .list();
    }

    private static Instant toInstant(Timestamp ts) { return ts != null ? ts.toInstant() : null; }
    private static Timestamp toTimestamp(Instant i) { return i != null ? Timestamp.from(i) : null; }
}
