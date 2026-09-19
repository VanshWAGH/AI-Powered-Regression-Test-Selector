package com.rts.rts_backend.recommendation.engine;

import com.rts.rts_backend.analysis.service.AnalysisService;
import com.rts.rts_backend.coverage.dao.CoverageDao;
import com.rts.rts_backend.recommendation.model.RankedTest;
import com.rts.rts_backend.recommendation.model.TestRecommendation;
import com.rts.rts_backend.repository.model.Repository;
import com.rts.rts_backend.testreport.dao.TestReportDao;
import com.rts.rts_backend.testreport.model.TestReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * The core recommendation engine.
 *
 * <p>Combines three signals to produce a ranked list of tests:
 * <ol>
 *   <li><b>Code change impact</b> — tests whose classes/methods overlap with the changed code</li>
 *   <li><b>Historical failure rate</b> — tests that have recently failed more are riskier</li>
 *   <li><b>Coverage overlap</b> — tests that cover the changed files</li>
 * </ol>
 *
 * <p>Each signal produces a 0.0–1.0 score. They are combined using configurable weights
 * into a composite score. Tests above the threshold are recommended for execution.
 */
@Component
public class RecommendationEngine {

    private static final Logger log = LoggerFactory.getLogger(RecommendationEngine.class);

    private final AnalysisService analysisService;
    private final TestReportDao testReportDao;
    private final CoverageDao coverageDao;

    private final double weightCodeImpact;
    private final double weightFailureHistory;
    private final double weightCoverage;
    private final double recommendationThreshold;

    public RecommendationEngine(
            AnalysisService analysisService,
            TestReportDao testReportDao,
            CoverageDao coverageDao,
            @Value("${rts.recommendation.weight-code-impact:0.50}") double weightCodeImpact,
            @Value("${rts.recommendation.weight-failure-history:0.30}") double weightFailureHistory,
            @Value("${rts.recommendation.weight-coverage:0.20}") double weightCoverage,
            @Value("${rts.recommendation.threshold:0.3}") double recommendationThreshold) {
        this.analysisService = analysisService;
        this.testReportDao = testReportDao;
        this.coverageDao = coverageDao;
        this.weightCodeImpact = weightCodeImpact;
        this.weightFailureHistory = weightFailureHistory;
        this.weightCoverage = weightCoverage;
        this.recommendationThreshold = recommendationThreshold;
    }

    /**
     * Generate test recommendations for a merge request.
     *
     * @param repository     the repository entity
     * @param mergeRequestId the merge request UUID as string
     * @param baseCommit     the target branch commit SHA
     * @param headCommit     the source branch commit SHA
     * @param allTests       set of all known test class#method identifiers in the repo
     * @return ranked and filtered test recommendations
     */
    public TestRecommendation recommend(
            Repository repository,
            String mergeRequestId,
            String baseCommit,
            String headCommit,
            Set<String> allTests) {

        UUID repoId = repository.getId();

        // Signal 1: Code impact — which methods were changed?
        List<String> impactedMethods;
        try {
            impactedMethods = analysisService.analyzeMergeRequestImpact(repository, baseCommit, headCommit);
        } catch (Exception e) {
            log.warn("Code impact analysis failed for MR {}, falling back to empty impact", mergeRequestId, e);
            impactedMethods = List.of();
        }
        Set<String> impactedSet = new HashSet<>(impactedMethods);

        // Signal 2: Coverage — which classes are covered by tests?
        Set<String> coveredClasses;
        try {
            coveredClasses = new HashSet<>(coverageDao.findCoveredClassNames(repoId));
        } catch (Exception e) {
            log.warn("Coverage lookup failed for repo {}, falling back to empty coverage", repoId, e);
            coveredClasses = Set.of();
        }

        // Signal 3: Historical failure rate per test
        // We compute: failureRate = failures / totalRuns (over last N runs)

        List<RankedTest> rankedTests = new ArrayList<>();
        long totalEstimatedDuration = 0;
        long recommendedDuration = 0;

        for (String testId : allTests) {
            String[] parts = testId.split("#", 2);
            String testClass = parts[0];
            String testMethod = parts.length > 1 ? parts[1] : "";

            Map<String, Double> signals = new LinkedHashMap<>();

            // --- Code impact score ---
            double codeImpactScore = 0.0;
            if (!impactedSet.isEmpty()) {
                // Check if the test class matches any impacted class, or if the test
                // targets a class that was impacted
                for (String impacted : impactedSet) {
                    if (testClass.contains(impacted.split("#")[0]) ||
                        impacted.split("#")[0].contains(testClass.replace("Test", ""))) {
                        codeImpactScore = 1.0;
                        break;
                    }
                }
            }
            signals.put("codeImpact", codeImpactScore);

            // --- Failure history score ---
            double failureScore = 0.0;
            long avgDuration = 5000; // default 5s
            try {
                List<TestReport> history = testReportDao.findByRepositoryAndMethod(repoId, testClass, testMethod);
                if (!history.isEmpty()) {
                    long failures = history.stream()
                            .filter(r -> r.getStatus() == TestReport.TestStatus.FAILED ||
                                         r.getStatus() == TestReport.TestStatus.ERROR)
                            .count();
                    failureScore = (double) failures / history.size();
                    avgDuration = (long) history.stream()
                            .mapToLong(TestReport::getDurationMs)
                            .average()
                            .orElse(5000);
                }
            } catch (Exception e) {
                log.debug("Failed to fetch history for {}#{}", testClass, testMethod);
            }
            signals.put("failureHistory", failureScore);

            // --- Coverage overlap score ---
            double coverageScore = 0.0;
            String testedClass = testClass.replace("Test", "").replace("IT", "");
            if (coveredClasses.contains(testedClass)) {
                coverageScore = 1.0;
            }
            signals.put("coverageOverlap", coverageScore);

            // --- Composite score ---
            double compositeScore = (codeImpactScore * weightCodeImpact) +
                                    (failureScore * weightFailureHistory) +
                                    (coverageScore * weightCoverage);

            boolean isRecommended = compositeScore >= recommendationThreshold;

            totalEstimatedDuration += avgDuration;
            if (isRecommended) {
                recommendedDuration += avgDuration;
            }

            rankedTests.add(new RankedTest(testClass, testMethod, compositeScore, isRecommended, signals));
        }

        // Sort by score descending
        rankedTests.sort(Comparator.comparingDouble(RankedTest::score).reversed());

        int recommendedCount = (int) rankedTests.stream().filter(RankedTest::recommended).count();
        double timeReduction = totalEstimatedDuration > 0
                ? ((totalEstimatedDuration - recommendedDuration) * 100.0) / totalEstimatedDuration
                : 0.0;

        log.info("Recommendation for MR {}: {}/{} tests recommended, estimated time reduction: {}%",
                mergeRequestId, recommendedCount, allTests.size(), String.format("%.1f", timeReduction));

        return new TestRecommendation(
                mergeRequestId,
                repoId.toString(),
                allTests.size(),
                recommendedCount,
                timeReduction,
                rankedTests
        );
    }
}
