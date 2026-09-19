package com.rts.rts_backend.testreport.dao;

import com.rts.rts_backend.testreport.model.TestReport;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
public class TestReportDao {

    private final JdbcClient jdbc;

    public TestReportDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<TestReport> ROW_MAPPER = (rs, rowNum) -> {
        TestReport r = new TestReport();
        r.setId(rs.getObject("id", UUID.class));
        r.setRepositoryId(rs.getObject("repository_id", UUID.class));
        r.setCommitSha(rs.getString("commit_sha"));
        r.setClassName(rs.getString("class_name"));
        r.setMethodName(rs.getString("method_name"));
        r.setStatus(TestReport.TestStatus.valueOf(rs.getString("status")));
        r.setDurationMs(rs.getLong("duration_ms"));
        r.setFailureMessage(rs.getString("failure_message"));
        r.setCreatedAt(toInstant(rs.getTimestamp("created_at")));
        return r;
    };

    public void insertBatch(List<TestReport> reports) {
        // JdbcClient doesn't have a direct batchUpdate with named parameters that takes a List of objects easily.
        // We will use standard JdbcTemplate under the hood for batch inserts or loop for now.
        // For simplicity and to avoid raw JdbcTemplate mapping, we just loop (or use Spring JDBC batch).
        for (TestReport r : reports) {
            jdbc.sql("""
                    INSERT INTO test_reports (
                        id, repository_id, commit_sha, class_name, method_name, status, duration_ms, failure_message, created_at
                    ) VALUES (
                        :id, :repoId, :commitSha, :className, :methodName, :status, :durationMs, :failureMsg, :createdAt
                    )
                    """)
                    .param("id", r.getId())
                    .param("repoId", r.getRepositoryId())
                    .param("commitSha", r.getCommitSha())
                    .param("className", r.getClassName())
                    .param("methodName", r.getMethodName())
                    .param("status", r.getStatus().name())
                    .param("durationMs", r.getDurationMs())
                    .param("failureMsg", r.getFailureMessage())
                    .param("createdAt", toTimestamp(r.getCreatedAt()))
                    .update();
        }
    }

    public List<TestReport> findByRepositoryAndMethod(UUID repositoryId, String className, String methodName) {
        return jdbc.sql("""
                SELECT * FROM test_reports 
                WHERE repository_id = :repoId 
                  AND class_name = :className 
                  AND method_name = :methodName
                ORDER BY created_at DESC
                """)
                .param("repoId", repositoryId)
                .param("className", className)
                .param("methodName", methodName)
                .query(ROW_MAPPER)
                .list();
    }

    /**
     * Returns all distinct test identifiers (className#methodName) for a repository.
     */
    public List<String> findDistinctTestIdentifiers(UUID repositoryId) {
        return jdbc.sql("""
                SELECT DISTINCT class_name || '#' || method_name AS test_id
                FROM test_reports
                WHERE repository_id = :repoId
                """)
                .param("repoId", repositoryId)
                .query(String.class)
                .list();
    }

    private static Instant toInstant(Timestamp ts) {
        return ts != null ? ts.toInstant() : null;
    }

    private static Timestamp toTimestamp(Instant instant) {
        return instant != null ? Timestamp.from(instant) : null;
    }
}
