package com.rts.rts_backend.recommendation.model;

import java.util.Map;

/**
 * A single test ranked by the recommendation engine.
 */
public record RankedTest(
        String className,
        String methodName,
        double score,
        boolean recommended,
        Map<String, Double> signalBreakdown
) {}
