package com.rts.rts_backend.gitlab.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GitLabMergeRequestEvent(
        @JsonProperty("object_kind")
        String objectKind,
        
        @JsonProperty("event_type")
        String eventType,

        @JsonProperty("project")
        Project project,

        @JsonProperty("object_attributes")
        ObjectAttributes objectAttributes
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Project(
            @JsonProperty("id") Long id,
            @JsonProperty("name") String name,
            @JsonProperty("web_url") String webUrl
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ObjectAttributes(
            @JsonProperty("id") Long id,
            @JsonProperty("iid") Integer iid,
            @JsonProperty("title") String title,
            @JsonProperty("state") String state,
            @JsonProperty("source_branch") String sourceBranch,
            @JsonProperty("target_branch") String targetBranch,
            @JsonProperty("last_commit") LastCommit lastCommit,
            @JsonProperty("target") Target target,
            @JsonProperty("url") String url,
            @JsonProperty("action") String action
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LastCommit(
            @JsonProperty("id") String id
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Target(
            @JsonProperty("default_branch") String defaultBranch
    ) {}
}
