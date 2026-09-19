package com.rts.rts_backend.analysis.model;

import java.util.List;

public record GitDiffResult(
        String baseCommit,
        String headCommit,
        List<ChangedFile> changedFiles
) {}
