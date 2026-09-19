package com.rts.rts_backend.repository.dao;

import com.rts.rts_backend.repository.model.BuildSystem;
import com.rts.rts_backend.repository.model.ConnectionStatus;
import com.rts.rts_backend.repository.model.Repository;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data-access object for the {@code repositories} table.
 * Uses Spring JDBC's {@link JdbcClient} for fluent, type-safe queries.
 */
@Component
public class RepositoryDao {

    private final JdbcClient jdbc;

    public RepositoryDao(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    // ---- Row Mapper ----

    private static final RowMapper<Repository> ROW_MAPPER = (rs, rowNum) -> {
        Repository repo = new Repository();
        repo.setId(rs.getObject("id", UUID.class));
        repo.setName(rs.getString("name"));
        repo.setGitlabBaseUrl(rs.getString("gitlab_base_url"));
        repo.setGitlabProjectId(rs.getLong("gitlab_project_id"));
        repo.setGitlabProjectPath(rs.getString("gitlab_project_path"));
        repo.setDefaultBranch(rs.getString("default_branch"));
        repo.setBuildSystem(BuildSystem.valueOf(rs.getString("build_system")));
        repo.setTestFramework(rs.getString("test_framework"));
        repo.setAccessTokenEncrypted(rs.getBytes("access_token_encrypted"));
        repo.setWebhookSecretHash(rs.getString("webhook_secret_hash"));
        repo.setConnectionStatus(ConnectionStatus.valueOf(rs.getString("connection_status")));
        repo.setLastSyncedAt(toInstant(rs.getTimestamp("last_synced_at")));
        repo.setCreatedAt(toInstant(rs.getTimestamp("created_at")));
        repo.setUpdatedAt(toInstant(rs.getTimestamp("updated_at")));
        return repo;
    };

    // ---- CRUD ----

    public void insert(Repository repo) {
        jdbc.sql("""
                INSERT INTO repositories (
                    id, name, gitlab_base_url, gitlab_project_id, gitlab_project_path,
                    default_branch, build_system, test_framework,
                    access_token_encrypted, webhook_secret_hash,
                    connection_status, last_synced_at, created_at, updated_at
                ) VALUES (
                    :id, :name, :gitlabBaseUrl, :gitlabProjectId, :gitlabProjectPath,
                    :defaultBranch, :buildSystem, :testFramework,
                    :accessTokenEncrypted, :webhookSecretHash,
                    :connectionStatus, :lastSyncedAt, :createdAt, :updatedAt
                )
                """)
                .param("id", repo.getId())
                .param("name", repo.getName())
                .param("gitlabBaseUrl", repo.getGitlabBaseUrl())
                .param("gitlabProjectId", repo.getGitlabProjectId())
                .param("gitlabProjectPath", repo.getGitlabProjectPath())
                .param("defaultBranch", repo.getDefaultBranch())
                .param("buildSystem", repo.getBuildSystem().name())
                .param("testFramework", repo.getTestFramework())
                .param("accessTokenEncrypted", repo.getAccessTokenEncrypted())
                .param("webhookSecretHash", repo.getWebhookSecretHash())
                .param("connectionStatus", repo.getConnectionStatus().name())
                .param("lastSyncedAt", toTimestamp(repo.getLastSyncedAt()))
                .param("createdAt", toTimestamp(repo.getCreatedAt()))
                .param("updatedAt", toTimestamp(repo.getUpdatedAt()))
                .update();
    }

    public Optional<Repository> findById(UUID id) {
        return jdbc.sql("SELECT * FROM repositories WHERE id = :id")
                .param("id", id)
                .query(ROW_MAPPER)
                .optional();
    }

    public List<Repository> findAll() {
        return jdbc.sql("SELECT * FROM repositories ORDER BY created_at DESC")
                .query(ROW_MAPPER)
                .list();
    }

    public void update(Repository repo) {
        jdbc.sql("""
                UPDATE repositories SET
                    name = :name,
                    gitlab_base_url = :gitlabBaseUrl,
                    gitlab_project_id = :gitlabProjectId,
                    gitlab_project_path = :gitlabProjectPath,
                    default_branch = :defaultBranch,
                    build_system = :buildSystem,
                    test_framework = :testFramework,
                    access_token_encrypted = :accessTokenEncrypted,
                    webhook_secret_hash = :webhookSecretHash,
                    connection_status = :connectionStatus,
                    last_synced_at = :lastSyncedAt,
                    updated_at = :updatedAt
                WHERE id = :id
                """)
                .param("id", repo.getId())
                .param("name", repo.getName())
                .param("gitlabBaseUrl", repo.getGitlabBaseUrl())
                .param("gitlabProjectId", repo.getGitlabProjectId())
                .param("gitlabProjectPath", repo.getGitlabProjectPath())
                .param("defaultBranch", repo.getDefaultBranch())
                .param("buildSystem", repo.getBuildSystem().name())
                .param("testFramework", repo.getTestFramework())
                .param("accessTokenEncrypted", repo.getAccessTokenEncrypted())
                .param("webhookSecretHash", repo.getWebhookSecretHash())
                .param("connectionStatus", repo.getConnectionStatus().name())
                .param("lastSyncedAt", toTimestamp(repo.getLastSyncedAt()))
                .param("updatedAt", toTimestamp(repo.getUpdatedAt()))
                .update();
    }

    public boolean deleteById(UUID id) {
        int rows = jdbc.sql("DELETE FROM repositories WHERE id = :id")
                .param("id", id)
                .update();
        return rows > 0;
    }

    public boolean existsByGitlabProject(String baseUrl, Long projectId) {
        return jdbc.sql("""
                SELECT COUNT(*) FROM repositories
                WHERE gitlab_base_url = :baseUrl AND gitlab_project_id = :projectId
                """)
                .param("baseUrl", baseUrl)
                .param("projectId", projectId)
                .query(Integer.class)
                .single() > 0;
    }

    // ---- Timestamp helpers ----

    private static Instant toInstant(Timestamp ts) {
        return ts != null ? ts.toInstant() : null;
    }

    private static Timestamp toTimestamp(Instant instant) {
        return instant != null ? Timestamp.from(instant) : null;
    }
}
