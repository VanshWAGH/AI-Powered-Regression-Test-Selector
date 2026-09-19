package com.rts.rts_backend.pipeline.model;

import java.time.Instant;
import java.util.UUID;

public class PipelineRun {

    private UUID id;
    private UUID repositoryId;
    private UUID mergeRequestId;
    private Long gitlabPipelineId;
    private String commitSha;
    private String status;
    private String source;
    private boolean usedRecommendation;
    private Integer totalTests;
    private Integer selectedTests;
    private Integer durationSeconds;
    private String webUrl;
    private Instant startedAt;
    private Instant finishedAt;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getRepositoryId() { return repositoryId; }
    public void setRepositoryId(UUID repositoryId) { this.repositoryId = repositoryId; }
    public UUID getMergeRequestId() { return mergeRequestId; }
    public void setMergeRequestId(UUID mergeRequestId) { this.mergeRequestId = mergeRequestId; }
    public Long getGitlabPipelineId() { return gitlabPipelineId; }
    public void setGitlabPipelineId(Long gitlabPipelineId) { this.gitlabPipelineId = gitlabPipelineId; }
    public String getCommitSha() { return commitSha; }
    public void setCommitSha(String commitSha) { this.commitSha = commitSha; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public boolean isUsedRecommendation() { return usedRecommendation; }
    public void setUsedRecommendation(boolean usedRecommendation) { this.usedRecommendation = usedRecommendation; }
    public Integer getTotalTests() { return totalTests; }
    public void setTotalTests(Integer totalTests) { this.totalTests = totalTests; }
    public Integer getSelectedTests() { return selectedTests; }
    public void setSelectedTests(Integer selectedTests) { this.selectedTests = selectedTests; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getWebUrl() { return webUrl; }
    public void setWebUrl(String webUrl) { this.webUrl = webUrl; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getFinishedAt() { return finishedAt; }
    public void setFinishedAt(Instant finishedAt) { this.finishedAt = finishedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
