package com.rts.rts_backend.coverage.dao;

import com.rts.rts_backend.coverage.model.CoverageDetail;
import com.rts.rts_backend.coverage.model.CoverageReport;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CoverageDao {

    private final JdbcClient jdbc;

    public CoverageDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    // ---- CoverageReport ----

    private static final RowMapper<CoverageReport> REPORT_MAPPER = (rs, rowNum) -> {
        CoverageReport r = new CoverageReport();
        r.setId(rs.getObject("id", UUID.class));
        r.setRepositoryId(rs.getObject("repository_id", UUID.class));
        r.setCommitSha(rs.getString("commit_sha"));
        r.setLineCoveragePct(rs.getObject("line_coverage_pct", Double.class));
        r.setBranchCoveragePct(rs.getObject("branch_coverage_pct", Double.class));
        r.setTotalLines(rs.getObject("total_lines", Integer.class));
        r.setCoveredLines(rs.getObject("covered_lines", Integer.class));
        r.setCreatedAt(toInstant(rs.getTimestamp("created_at")));
        return r;
    };

    public void insertReport(CoverageReport report) {
        jdbc.sql("""
                INSERT INTO coverage_reports (
                    id, repository_id, commit_sha, line_coverage_pct, branch_coverage_pct,
                    total_lines, covered_lines, created_at
                ) VALUES (
                    :id, :repoId, :commitSha, :linePct, :branchPct,
                    :totalLines, :coveredLines, :createdAt
                )
                """)
                .param("id", report.getId())
                .param("repoId", report.getRepositoryId())
                .param("commitSha", report.getCommitSha())
                .param("linePct", report.getLineCoveragePct())
                .param("branchPct", report.getBranchCoveragePct())
                .param("totalLines", report.getTotalLines())
                .param("coveredLines", report.getCoveredLines())
                .param("createdAt", toTimestamp(report.getCreatedAt()))
                .update();
    }

    public Optional<CoverageReport> findLatestByRepositoryId(UUID repositoryId) {
        return jdbc.sql("""
                SELECT * FROM coverage_reports
                WHERE repository_id = :repoId
                ORDER BY created_at DESC
                LIMIT 1
                """)
                .param("repoId", repositoryId)
                .query(REPORT_MAPPER)
                .optional();
    }

    // ---- CoverageDetail ----

    public void insertDetails(List<CoverageDetail> details) {
        for (CoverageDetail d : details) {
            jdbc.sql("""
                    INSERT INTO coverage_details (
                        id, coverage_report_id, class_name, method_name,
                        line_start, line_end, covered, hit_count
                    ) VALUES (
                        :id, :reportId, :className, :methodName,
                        :lineStart, :lineEnd, :covered, :hitCount
                    )
                    """)
                    .param("id", d.getId())
                    .param("reportId", d.getCoverageReportId())
                    .param("className", d.getClassName())
                    .param("methodName", d.getMethodName())
                    .param("lineStart", d.getLineStart())
                    .param("lineEnd", d.getLineEnd())
                    .param("covered", d.isCovered())
                    .param("hitCount", d.getHitCount())
                    .update();
        }
    }

    public List<CoverageDetail> findDetailsByReportId(UUID reportId) {
        return jdbc.sql("SELECT * FROM coverage_details WHERE coverage_report_id = :reportId")
                .param("reportId", reportId)
                .query((rs, rowNum) -> {
                    CoverageDetail d = new CoverageDetail();
                    d.setId(rs.getObject("id", UUID.class));
                    d.setCoverageReportId(rs.getObject("coverage_report_id", UUID.class));
                    d.setClassName(rs.getString("class_name"));
                    d.setMethodName(rs.getString("method_name"));
                    d.setLineStart(rs.getObject("line_start", Integer.class));
                    d.setLineEnd(rs.getObject("line_end", Integer.class));
                    d.setCovered(rs.getBoolean("covered"));
                    d.setHitCount(rs.getInt("hit_count"));
                    return d;
                })
                .list();
    }

    /**
     * Find covered class names for a given repository's latest coverage report.
     */
    public List<String> findCoveredClassNames(UUID repositoryId) {
        return jdbc.sql("""
                SELECT DISTINCT cd.class_name
                FROM coverage_details cd
                JOIN coverage_reports cr ON cr.id = cd.coverage_report_id
                WHERE cr.repository_id = :repoId
                  AND cr.id = (
                      SELECT id FROM coverage_reports
                      WHERE repository_id = :repoId
                      ORDER BY created_at DESC
                      LIMIT 1
                  )
                  AND cd.covered = true
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
