package com.rts.rts_backend.coverage.model;

import java.time.Instant;
import java.util.UUID;

public class CoverageReport {

    private UUID id;
    private UUID repositoryId;
    private String commitSha;
    private Double lineCoveragePct;
    private Double branchCoveragePct;
    private Integer totalLines;
    private Integer coveredLines;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRepositoryId() { return repositoryId; }
    public void setRepositoryId(UUID repositoryId) { this.repositoryId = repositoryId; }

    public String getCommitSha() { return commitSha; }
    public void setCommitSha(String commitSha) { this.commitSha = commitSha; }

    public Double getLineCoveragePct() { return lineCoveragePct; }
    public void setLineCoveragePct(Double lineCoveragePct) { this.lineCoveragePct = lineCoveragePct; }

    public Double getBranchCoveragePct() { return branchCoveragePct; }
    public void setBranchCoveragePct(Double branchCoveragePct) { this.branchCoveragePct = branchCoveragePct; }

    public Integer getTotalLines() { return totalLines; }
    public void setTotalLines(Integer totalLines) { this.totalLines = totalLines; }

    public Integer getCoveredLines() { return coveredLines; }
    public void setCoveredLines(Integer coveredLines) { this.coveredLines = coveredLines; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
