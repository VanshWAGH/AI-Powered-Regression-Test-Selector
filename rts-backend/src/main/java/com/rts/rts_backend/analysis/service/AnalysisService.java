package com.rts.rts_backend.analysis.service;

import com.rts.rts_backend.analysis.ast.JavaAstAnalyzer;
import com.rts.rts_backend.analysis.git.GitService;
import com.rts.rts_backend.analysis.model.ChangedFile;
import com.rts.rts_backend.analysis.model.GitDiffResult;
import com.rts.rts_backend.analysis.model.JavaClassNode;
import com.rts.rts_backend.analysis.model.JavaMethodNode;
import com.rts.rts_backend.repository.model.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private final GitService gitService;
    private final JavaAstAnalyzer astAnalyzer;
    private final String workspaceDir;

    public AnalysisService(
            GitService gitService, 
            JavaAstAnalyzer astAnalyzer,
            @org.springframework.beans.factory.annotation.Value("${rts.analysis.workspace-dir:/tmp/rts-workspaces}") String workspaceDir) {
        this.gitService = gitService;
        this.astAnalyzer = astAnalyzer;
        this.workspaceDir = workspaceDir;
    }

    public List<String> analyzeMergeRequestImpact(Repository repository, String baseCommit, String headCommit) {
        log.info("Starting impact analysis for repo {}, base={}, head={}", repository.getId(), baseCommit, headCommit);
        
        // 1. Ensure git repo is locally available
        gitService.ensureRepository(repository);
        
        // 2. Checkout the head commit to read the files
        gitService.checkoutCommit(repository, headCommit);

        // 3. Get the changed files diff
        GitDiffResult diffResult = gitService.calculateDiff(repository, baseCommit, headCommit);
        
        List<String> impactedMethods = new ArrayList<>();
        File repoDir = new File(workspaceDir, repository.getId().toString());

        // 4. Parse AST for changed Java files
        for (ChangedFile changedFile : diffResult.changedFiles()) {
            if (changedFile.newPath() != null && changedFile.newPath().endsWith(".java")) {
                try {
                    // Read file directly from workspace since we just checked it out
                    Path filePath = repoDir.toPath().resolve(changedFile.newPath());
                    if (Files.exists(filePath)) {
                        String source = Files.readString(filePath);
                        List<JavaClassNode> classes = astAnalyzer.analyzeSource(source);
                        
                        // We would compare the patch/lines changed with the method ranges here
                        // For v1, if a file changed, we consider all its methods impacted
                        // or we could parse the patch to get changed lines.
                        for (JavaClassNode cls : classes) {
                            for (JavaMethodNode method : cls.methods()) {
                                // Add fully qualified method signature
                                impactedMethods.add(cls.fullyQualifiedName() + "#" + method.methodName());
                            }
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to parse AST for file: {}", changedFile.newPath(), e);
                }
            }
        }
        
        log.info("Analysis complete. Found {} impacted methods.", impactedMethods.size());
        return impactedMethods;
    }
}
