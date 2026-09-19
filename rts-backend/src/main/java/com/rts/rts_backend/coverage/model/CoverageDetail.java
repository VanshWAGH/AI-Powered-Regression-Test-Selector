package com.rts.rts_backend.coverage.model;

import java.util.UUID;

public class CoverageDetail {

    private UUID id;
    private UUID coverageReportId;
    private String className;
    private String methodName;
    private Integer lineStart;
    private Integer lineEnd;
    private boolean covered;
    private int hitCount;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCoverageReportId() { return coverageReportId; }
    public void setCoverageReportId(UUID coverageReportId) { this.coverageReportId = coverageReportId; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getMethodName() { return methodName; }
    public void setMethodName(String methodName) { this.methodName = methodName; }

    public Integer getLineStart() { return lineStart; }
    public void setLineStart(Integer lineStart) { this.lineStart = lineStart; }

    public Integer getLineEnd() { return lineEnd; }
    public void setLineEnd(Integer lineEnd) { this.lineEnd = lineEnd; }

    public boolean isCovered() { return covered; }
    public void setCovered(boolean covered) { this.covered = covered; }

    public int getHitCount() { return hitCount; }
    public void setHitCount(int hitCount) { this.hitCount = hitCount; }
}
