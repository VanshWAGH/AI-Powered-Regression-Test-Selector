package com.rts.rts_backend.mergerequest.dto;

import com.rts.rts_backend.mergerequest.model.MergeRequest;
import com.rts.rts_backend.mergerequest.model.MergeRequestState;

import java.time.Instant;
import java.util.UUID;

public record MergeRequestResponse(
        UUID id,
        UUID repositoryId,
        Integer gitlabIid,
        String title,
        String sourceBranch,
        String targetBranch,
        String sourceCommitSha,
        String targetCommitSha,
        String authorUsername,
        MergeRequestState state,
        String webUrl,
        Instant createdAt,
        Instant updatedAt
) {
    public static MergeRequestResponse from(MergeRequest mr) {
        return new MergeRequestResponse(
                mr.getId(),
                mr.getRepositoryId(),
                mr.getGitlabIid(),
                mr.getTitle(),
                mr.getSourceBranch(),
                mr.getTargetBranch(),
                mr.getSourceCommitSha(),
                mr.getTargetCommitSha(),
                mr.getAuthorUsername(),
                mr.getState(),
                mr.getWebUrl(),
                mr.getCreatedAt(),
                mr.getUpdatedAt()
        );
    }
}
