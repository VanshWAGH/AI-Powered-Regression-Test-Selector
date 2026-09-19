package com.rts.rts_backend.repository.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Domain entity representing a registered GitLab project.
 *
 * <p>This is the root aggregate for repository management — each
 * registered project has its own test history, coverage data,
 * recommendations, and pipeline tracking.
 */
public class Repository {

    private UUID id;
    private String name;
    private String gitlabBaseUrl;
    private Long gitlabProjectId;
    private String gitlabProjectPath;
    private String defaultBranch;
    private BuildSystem buildSystem;
    private String testFramework;
    private byte[] accessTokenEncrypted;
    private String webhookSecretHash;
    private ConnectionStatus connectionStatus;
    private Instant lastSyncedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public Repository() {
        // default constructor for row-mapping
    }

    // ---- Getters ----

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGitlabBaseUrl() {
        return gitlabBaseUrl;
    }

    public Long getGitlabProjectId() {
        return gitlabProjectId;
    }

    public String getGitlabProjectPath() {
        return gitlabProjectPath;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public BuildSystem getBuildSystem() {
        return buildSystem;
    }

    public String getTestFramework() {
        return testFramework;
    }

    public byte[] getAccessTokenEncrypted() {
        return accessTokenEncrypted;
    }

    public String getWebhookSecretHash() {
        return webhookSecretHash;
    }

    public ConnectionStatus getConnectionStatus() {
        return connectionStatus;
    }

    public Instant getLastSyncedAt() {
        return lastSyncedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    // ---- Setters ----

    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGitlabBaseUrl(String gitlabBaseUrl) {
        this.gitlabBaseUrl = gitlabBaseUrl;
    }

    public void setGitlabProjectId(Long gitlabProjectId) {
        this.gitlabProjectId = gitlabProjectId;
    }

    public void setGitlabProjectPath(String gitlabProjectPath) {
        this.gitlabProjectPath = gitlabProjectPath;
    }

    public void setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
    }

    public void setBuildSystem(BuildSystem buildSystem) {
        this.buildSystem = buildSystem;
    }

    public void setTestFramework(String testFramework) {
        this.testFramework = testFramework;
    }

    public void setAccessTokenEncrypted(byte[] accessTokenEncrypted) {
        this.accessTokenEncrypted = accessTokenEncrypted;
    }

    public void setWebhookSecretHash(String webhookSecretHash) {
        this.webhookSecretHash = webhookSecretHash;
    }

    public void setConnectionStatus(ConnectionStatus connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public void setLastSyncedAt(Instant lastSyncedAt) {
        this.lastSyncedAt = lastSyncedAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Repository{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gitlabProjectId=" + gitlabProjectId +
                ", connectionStatus=" + connectionStatus +
                '}';
    }
}
