package com.rts.rts_backend.analysis.model;

public record ChangedFile(
        String oldPath,
        String newPath,
        ChangeType changeType,
        String patchContent
) {
    public enum ChangeType {
        ADD,
        MODIFY,
        DELETE,
        RENAME,
        COPY
    }
}
