package com.rts.rts_backend.analysis.model;

import java.util.List;

public record JavaMethodNode(
        String methodName,
        String signature,
        int startLine,
        int endLine,
        List<String> annotations
) {}
