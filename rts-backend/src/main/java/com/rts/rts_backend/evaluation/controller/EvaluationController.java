package com.rts.rts_backend.evaluation.controller;

import com.rts.rts_backend.common.web.ApiResponse;
import com.rts.rts_backend.evaluation.dao.EvaluationDao;
import com.rts.rts_backend.evaluation.model.RecommendationEvaluation;
import com.rts.rts_backend.evaluation.service.EvaluationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    /**
     * Submit evaluation data after a pipeline run completes.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RecommendationEvaluation>> evaluate(
            @RequestParam UUID pipelineRunId,
            @RequestParam int actualFailedTests,
            @RequestParam int caughtBySelection,
            @RequestParam int fullRunDurationSeconds,
            HttpServletRequest request) {

        RecommendationEvaluation eval = evaluationService.evaluate(
                pipelineRunId, actualFailedTests, caughtBySelection, fullRunDurationSeconds);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(eval, requestId(request)));
    }

    /**
     * Get evaluation history for a repository.
     */
    @GetMapping("/repositories/{repositoryId}")
    public ResponseEntity<ApiResponse<List<RecommendationEvaluation>>> getEvaluations(
            @PathVariable UUID repositoryId,
            HttpServletRequest request) {

        List<RecommendationEvaluation> evaluations = evaluationService.getEvaluations(repositoryId);
        return ResponseEntity.ok(ApiResponse.of(evaluations, requestId(request), null, evaluations.size()));
    }

    /**
     * Get aggregate statistics for a repository's recommendations.
     */
    @GetMapping("/repositories/{repositoryId}/stats")
    public ResponseEntity<ApiResponse<EvaluationDao.AggregateStats>> getStats(
            @PathVariable UUID repositoryId,
            HttpServletRequest request) {

        EvaluationDao.AggregateStats stats = evaluationService.getAggregateStats(repositoryId);
        return ResponseEntity.ok(ApiResponse.of(stats, requestId(request)));
    }

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
