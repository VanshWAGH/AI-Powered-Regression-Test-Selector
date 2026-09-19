package com.rts.rts_backend.recommendation.controller;

import com.rts.rts_backend.common.web.ApiResponse;
import com.rts.rts_backend.recommendation.model.TestRecommendation;
import com.rts.rts_backend.recommendation.service.RecommendationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST endpoints for generating test recommendations.
 */
@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Generate recommendations for a specific merge request.
     */
    @PostMapping("/merge-requests/{mergeRequestId}")
    public ResponseEntity<ApiResponse<TestRecommendation>> recommendForMergeRequest(
            @PathVariable UUID mergeRequestId,
            HttpServletRequest request) {

        TestRecommendation recommendation = recommendationService.recommendForMergeRequest(mergeRequestId);
        return ResponseEntity.ok(ApiResponse.of(recommendation, requestId(request)));
    }

    /**
     * Generate recommendations from explicit commit SHAs (CLI / CI integration).
     */
    @PostMapping("/repositories/{repositoryId}/commits")
    public ResponseEntity<ApiResponse<TestRecommendation>> recommendForCommits(
            @PathVariable UUID repositoryId,
            @RequestParam String baseCommit,
            @RequestParam String headCommit,
            HttpServletRequest request) {

        TestRecommendation recommendation = recommendationService.recommendForCommits(repositoryId, baseCommit, headCommit);
        return ResponseEntity.ok(ApiResponse.of(recommendation, requestId(request)));
    }

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
