package com.rts.rts_backend.mergerequest.model;

import java.time.Instant;
import java.util.UUID;

public class MergeRequest {

    private UUID id;
    private UUID repositoryId;
    private Integer gitlabIid;
    private String title;
    private String sourceBranch;
    private String targetBranch;
    private String sourceCommitSha;
    private String targetCommitSha;
    private String authorUsername;
    private MergeRequestState state;
    private String webUrl;
    private Instant createdAt;
    private Instant updatedAt;

    public MergeRequest() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRepositoryId() { return repositoryId; }
    public void setRepositoryId(UUID repositoryId) { this.repositoryId = repositoryId; }

    public Integer getGitlabIid() { return gitlabIid; }
    public void setGitlabIid(Integer gitlabIid) { this.gitlabIid = gitlabIid; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSourceBranch() { return sourceBranch; }
    public void setSourceBranch(String sourceBranch) { this.sourceBranch = sourceBranch; }

    public String getTargetBranch() { return targetBranch; }
    public void setTargetBranch(String targetBranch) { this.targetBranch = targetBranch; }

    public String getSourceCommitSha() { return sourceCommitSha; }
    public void setSourceCommitSha(String sourceCommitSha) { this.sourceCommitSha = sourceCommitSha; }

    public String getTargetCommitSha() { return targetCommitSha; }
    public void setTargetCommitSha(String targetCommitSha) { this.targetCommitSha = targetCommitSha; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public MergeRequestState getState() { return state; }
    public void setState(MergeRequestState state) { this.state = state; }

    public String getWebUrl() { return webUrl; }
    public void setWebUrl(String webUrl) { this.webUrl = webUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
