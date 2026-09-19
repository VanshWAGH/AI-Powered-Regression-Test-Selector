package com.rts.rts_backend.recommendation.model;

import java.util.List;

/**
 * The output of the recommendation engine for a given merge request.
 */
public record TestRecommendation(
        String mergeRequestId,
        String repositoryId,
        int totalTestsConsidered,
        int recommendedCount,
        double estimatedTimeReductionPct,
        List<RankedTest> rankedTests
) {}
