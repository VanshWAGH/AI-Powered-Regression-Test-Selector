package com.rts.rts_backend.repository.service;

import com.rts.rts_backend.repository.dto.CreateRepositoryRequest;
import com.rts.rts_backend.repository.dto.RepositoryResponse;
import com.rts.rts_backend.repository.dto.UpdateRepositoryRequest;
import com.rts.rts_backend.repository.dto.ValidationResult;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for repository (GitLab project) management.
 */
public interface RepositoryService {

    /** Register a new GitLab project. */
    RepositoryResponse create(CreateRepositoryRequest request);

    /** Get a single repository by ID. */
    RepositoryResponse getById(UUID id);

    /** List all registered repositories. */
    List<RepositoryResponse> getAll();

    /** Partially update a repository. */
    RepositoryResponse update(UUID id, UpdateRepositoryRequest request);

    /** Delete a repository and all related data. */
    void delete(UUID id);

    /** Validate the GitLab connection and permissions. */
    ValidationResult validate(UUID id);

    /** Sync project metadata (name, path, default branch) from GitLab. */
    RepositoryResponse sync(UUID id);
}
