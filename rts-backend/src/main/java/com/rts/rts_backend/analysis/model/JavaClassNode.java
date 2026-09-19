package com.rts.rts_backend.analysis.model;

import java.util.List;

public record JavaClassNode(
        String packageName,
        String className,
        String fullyQualifiedName,
        List<JavaMethodNode> methods
) {}
