package com.rts.rts_backend.evaluation.model;

import java.time.Instant;
import java.util.UUID;

public class RecommendationEvaluation {

    private UUID id;
    private UUID pipelineRunId;
    private UUID repositoryId;
    private int totalTests;
    private int selectedTests;
    private int missedFailures;
    private int caughtFailures;
    private Double recallPct;
    private Double precisionPct;
    private Integer timeSavedSeconds;
    private Double timeSavedPct;
    private Instant evaluatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getPipelineRunId() { return pipelineRunId; }
    public void setPipelineRunId(UUID pipelineRunId) { this.pipelineRunId = pipelineRunId; }
    public UUID getRepositoryId() { return repositoryId; }
    public void setRepositoryId(UUID repositoryId) { this.repositoryId = repositoryId; }
    public int getTotalTests() { return totalTests; }
    public void setTotalTests(int totalTests) { this.totalTests = totalTests; }
    public int getSelectedTests() { return selectedTests; }
    public void setSelectedTests(int selectedTests) { this.selectedTests = selectedTests; }
    public int getMissedFailures() { return missedFailures; }
    public void setMissedFailures(int missedFailures) { this.missedFailures = missedFailures; }
    public int getCaughtFailures() { return caughtFailures; }
    public void setCaughtFailures(int caughtFailures) { this.caughtFailures = caughtFailures; }
    public Double getRecallPct() { return recallPct; }
    public void setRecallPct(Double recallPct) { this.recallPct = recallPct; }
    public Double getPrecisionPct() { return precisionPct; }
    public void setPrecisionPct(Double precisionPct) { this.precisionPct = precisionPct; }
    public Integer getTimeSavedSeconds() { return timeSavedSeconds; }
    public void setTimeSavedSeconds(Integer timeSavedSeconds) { this.timeSavedSeconds = timeSavedSeconds; }
    public Double getTimeSavedPct() { return timeSavedPct; }
    public void setTimeSavedPct(Double timeSavedPct) { this.timeSavedPct = timeSavedPct; }
    public Instant getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(Instant evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
