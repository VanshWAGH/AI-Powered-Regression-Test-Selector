package com.rts.rts_backend.recommendation.service;

import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.mergerequest.dao.MergeRequestDao;
import com.rts.rts_backend.mergerequest.model.MergeRequest;
import com.rts.rts_backend.recommendation.engine.RecommendationEngine;
import com.rts.rts_backend.recommendation.model.TestRecommendation;
import com.rts.rts_backend.repository.dao.RepositoryDao;
import com.rts.rts_backend.repository.model.Repository;
import com.rts.rts_backend.testreport.dao.TestReportDao;
import com.rts.rts_backend.testreport.model.TestReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Orchestrates the recommendation flow for a given merge request.
 */
@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final RepositoryDao repositoryDao;
    private final MergeRequestDao mergeRequestDao;
    private final TestReportDao testReportDao;
    private final RecommendationEngine engine;

    public RecommendationService(RepositoryDao repositoryDao,
                                  MergeRequestDao mergeRequestDao,
                                  TestReportDao testReportDao,
                                  RecommendationEngine engine) {
        this.repositoryDao = repositoryDao;
        this.mergeRequestDao = mergeRequestDao;
        this.testReportDao = testReportDao;
        this.engine = engine;
    }

    /**
     * Generate recommendations for a merge request by its database ID.
     */
    public TestRecommendation recommendForMergeRequest(UUID mergeRequestId) {
        MergeRequest mr = mergeRequestDao.findById(mergeRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("MergeRequest", mergeRequestId.toString()));

        Repository repo = repositoryDao.findById(mr.getRepositoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Repository", mr.getRepositoryId().toString()));

        String baseCommit = mr.getTargetCommitSha();
        String headCommit = mr.getSourceCommitSha();

        if (baseCommit == null || headCommit == null) {
            throw new IllegalStateException(
                    "MergeRequest " + mergeRequestId + " is missing commit SHAs. " +
                    "Ensure it has been synced from GitLab.");
        }

        // Discover all known tests from historical data
        Set<String> allTests = discoverKnownTests(repo.getId());
        if (allTests.isEmpty()) {
            log.warn("No historical test data found for repo {}. Returning empty recommendation.", repo.getId());
        }

        return engine.recommend(repo, mergeRequestId.toString(), baseCommit, headCommit, allTests);
    }

    /**
     * Generate recommendations from explicit commit SHAs (useful for CLI/CI integration).
     */
    public TestRecommendation recommendForCommits(UUID repositoryId, String baseCommit, String headCommit) {
        Repository repo = repositoryDao.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", repositoryId.toString()));

        Set<String> allTests = discoverKnownTests(repositoryId);
        return engine.recommend(repo, "adhoc-" + headCommit.substring(0, 8), baseCommit, headCommit, allTests);
    }

    /**
     * Discover all unique test identifiers from historical test reports.
     */
    private Set<String> discoverKnownTests(UUID repositoryId) {
        List<String> testIds = testReportDao.findDistinctTestIdentifiers(repositoryId);
        return new HashSet<>(testIds);
    }
}
