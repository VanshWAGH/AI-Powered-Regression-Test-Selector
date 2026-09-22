package com.rts.rts_backend.evaluation.dao;

import com.rts.rts_backend.evaluation.model.RecommendationEvaluation;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
public class EvaluationDao {

    private final JdbcClient jdbc;

    public EvaluationDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<RecommendationEvaluation> ROW_MAPPER = (rs, rowNum) -> {
        RecommendationEvaluation e = new RecommendationEvaluation();
        e.setId(rs.getObject("id", UUID.class));
        e.setPipelineRunId(rs.getObject("pipeline_run_id", UUID.class));
        e.setRepositoryId(rs.getObject("repository_id", UUID.class));
        e.setTotalTests(rs.getInt("total_tests"));
        e.setSelectedTests(rs.getInt("selected_tests"));
        e.setMissedFailures(rs.getInt("missed_failures"));
        e.setCaughtFailures(rs.getInt("caught_failures"));
        e.setRecallPct(rs.getObject("recall_pct", Double.class));
        e.setPrecisionPct(rs.getObject("precision_pct", Double.class));
        e.setTimeSavedSeconds(rs.getObject("time_saved_seconds", Integer.class));
        e.setTimeSavedPct(rs.getObject("time_saved_pct", Double.class));
        e.setEvaluatedAt(toInstant(rs.getTimestamp("evaluated_at")));
        return e;
    };

    public void insert(RecommendationEvaluation evaluation) {
        jdbc.sql("""
                INSERT INTO recommendation_evaluations (
                    id, pipeline_run_id, repository_id, total_tests, selected_tests,
                    missed_failures, caught_failures, recall_pct, precision_pct,
                    time_saved_seconds, time_saved_pct, evaluated_at
                ) VALUES (
                    :id, :pipelineRunId, :repoId, :totalTests, :selectedTests,
                    :missedFailures, :caughtFailures, :recallPct, :precisionPct,
                    :timeSaved, :timeSavedPct, :evaluatedAt
                )
                """)
                .param("id", evaluation.getId())
                .param("pipelineRunId", evaluation.getPipelineRunId())
                .param("repoId", evaluation.getRepositoryId())
                .param("totalTests", evaluation.getTotalTests())
                .param("selectedTests", evaluation.getSelectedTests())
                .param("missedFailures", evaluation.getMissedFailures())
                .param("caughtFailures", evaluation.getCaughtFailures())
                .param("recallPct", evaluation.getRecallPct())
                .param("precisionPct", evaluation.getPrecisionPct())
                .param("timeSaved", evaluation.getTimeSavedSeconds())
                .param("timeSavedPct", evaluation.getTimeSavedPct())
                .param("evaluatedAt", toTimestamp(evaluation.getEvaluatedAt()))
                .update();
    }

    public List<RecommendationEvaluation> findByRepositoryId(UUID repositoryId) {
        return jdbc.sql("SELECT * FROM recommendation_evaluations WHERE repository_id = :repoId ORDER BY evaluated_at DESC")
                .param("repoId", repositoryId)
                .query(ROW_MAPPER)
                .list();
    }

    public List<RecommendationEvaluation> findAll() {
        return jdbc.sql("SELECT * FROM recommendation_evaluations ORDER BY evaluated_at DESC")
                .query(ROW_MAPPER)
                .list();
    }

    /**
     * Get aggregate stats for a repository.
     */
    public AggregateStats getAggregateStats(UUID repositoryId) {
        return jdbc.sql("""
                SELECT
                    COUNT(*) as eval_count,
                    AVG(recall_pct) as avg_recall,
                    AVG(precision_pct) as avg_precision,
                    AVG(time_saved_pct) as avg_time_saved_pct,
                    SUM(time_saved_seconds) as total_time_saved
                FROM recommendation_evaluations
                WHERE repository_id = :repoId
                """)
                .param("repoId", repositoryId)
                .query((rs, rowNum) -> new AggregateStats(
                        rs.getInt("eval_count"),
                        rs.getObject("avg_recall", Double.class),
                        rs.getObject("avg_precision", Double.class),
                        rs.getObject("avg_time_saved_pct", Double.class),
                        rs.getObject("total_time_saved", Long.class)
                ))
                .optional()
                .orElse(new AggregateStats(0, null, null, null, null));
    }

    /**
     * Get aggregate stats across all repositories.
     */
    public AggregateStats getGlobalAggregateStats() {
        return jdbc.sql("""
                SELECT
                    COUNT(*) as eval_count,
                    AVG(recall_pct) as avg_recall,
                    AVG(precision_pct) as avg_precision,
                    AVG(time_saved_pct) as avg_time_saved_pct,
                    SUM(time_saved_seconds) as total_time_saved
                FROM recommendation_evaluations
                """)
                .query((rs, rowNum) -> new AggregateStats(
                        rs.getInt("eval_count"),
                        rs.getObject("avg_recall", Double.class),
                        rs.getObject("avg_precision", Double.class),
                        rs.getObject("avg_time_saved_pct", Double.class),
                        rs.getObject("total_time_saved", Long.class)
                ))
                .optional()
                .orElse(new AggregateStats(0, null, null, null, null));
    }

    public record AggregateStats(
            int evaluationCount,
            Double avgRecallPct,
            Double avgPrecisionPct,
            Double avgTimeSavedPct,
            Long totalTimeSavedSeconds
    ) {}

    private static Instant toInstant(Timestamp ts) { return ts != null ? ts.toInstant() : null; }
    private static Timestamp toTimestamp(Instant i) { return i != null ? Timestamp.from(i) : null; }
}
