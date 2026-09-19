package com.rts.rts_backend.gitlab.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Mapped response from GitLab's {@code GET /api/v4/projects/:id} endpoint.
 * Only the fields we need are mapped; unknown properties are ignored.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record GitLabProject(

        @JsonProperty("id")
        Long id,

        @JsonProperty("name")
        String name,

        @JsonProperty("path_with_namespace")
        String pathWithNamespace,

        @JsonProperty("default_branch")
        String defaultBranch,

        @JsonProperty("web_url")
        String webUrl,

        @JsonProperty("visibility")
        String visibility,

        @JsonProperty("archived")
        boolean archived
) {}
