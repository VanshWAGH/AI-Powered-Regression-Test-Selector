package com.rts.rts_backend.evaluation.service;

import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.common.util.IdGenerator;
import com.rts.rts_backend.common.util.TimeUtils;
import com.rts.rts_backend.evaluation.dao.EvaluationDao;
import com.rts.rts_backend.evaluation.model.RecommendationEvaluation;
import com.rts.rts_backend.pipeline.dao.PipelineRunDao;
import com.rts.rts_backend.pipeline.model.PipelineRun;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service that evaluates how well a recommendation performed
 * after the full CI pipeline has run.
 */
@Service
public class EvaluationService {

    private static final Logger log = LoggerFactory.getLogger(EvaluationService.class);

    private final EvaluationDao evaluationDao;
    private final PipelineRunDao pipelineRunDao;

    public EvaluationService(EvaluationDao evaluationDao, PipelineRunDao pipelineRunDao) {
        this.evaluationDao = evaluationDao;
        this.pipelineRunDao = pipelineRunDao;
    }

    /**
     * Evaluate a pipeline run by comparing the recommendation's selected tests
     * against the actual full-run results.
     *
     * @param pipelineRunId the pipeline run to evaluate
     * @param actualFailedTests number of tests that actually failed in the full run
     * @param caughtBySelection number of those failures that were in the recommended set
     * @param fullRunDurationSeconds total time of the full test suite run
     */
    @Transactional
    public RecommendationEvaluation evaluate(
            UUID pipelineRunId,
            int actualFailedTests,
            int caughtBySelection,
            int fullRunDurationSeconds) {

        PipelineRun run = pipelineRunDao.findById(pipelineRunId)
                .orElseThrow(() -> new ResourceNotFoundException("PipelineRun", pipelineRunId.toString()));

        int totalTests = run.getTotalTests() != null ? run.getTotalTests() : 0;
        int selectedTests = run.getSelectedTests() != null ? run.getSelectedTests() : 0;
        int missedFailures = actualFailedTests - caughtBySelection;

        double recall = actualFailedTests > 0
                ? (caughtBySelection * 100.0) / actualFailedTests
                : 100.0; // No failures = perfect recall

        double precision = selectedTests > 0
                ? (caughtBySelection * 100.0) / selectedTests
                : 0.0;

        int selectedDuration = run.getDurationSeconds() != null ? run.getDurationSeconds() : 0;
        int timeSaved = fullRunDurationSeconds - selectedDuration;
        double timeSavedPct = fullRunDurationSeconds > 0
                ? (timeSaved * 100.0) / fullRunDurationSeconds
                : 0.0;

        RecommendationEvaluation eval = new RecommendationEvaluation();
        eval.setId(IdGenerator.newId());
        eval.setPipelineRunId(pipelineRunId);
        eval.setRepositoryId(run.getRepositoryId());
        eval.setTotalTests(totalTests);
        eval.setSelectedTests(selectedTests);
        eval.setMissedFailures(Math.max(missedFailures, 0));
        eval.setCaughtFailures(caughtBySelection);
        eval.setRecallPct(recall);
        eval.setPrecisionPct(precision);
        eval.setTimeSavedSeconds(timeSaved);
        eval.setTimeSavedPct(timeSavedPct);
        eval.setEvaluatedAt(TimeUtils.now());

        evaluationDao.insert(eval);
        log.info("Evaluation recorded: pipeline={}, recall={}%, timeSaved={}%",
                pipelineRunId, String.format("%.1f", recall), String.format("%.1f", timeSavedPct));

        return eval;
    }

    public List<RecommendationEvaluation> getEvaluations(UUID repositoryId) {
        return evaluationDao.findByRepositoryId(repositoryId);
    }

    public EvaluationDao.AggregateStats getAggregateStats(UUID repositoryId) {
        return evaluationDao.getAggregateStats(repositoryId);
    }
}
