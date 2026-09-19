package com.rts.rts_backend.repository.controller;

import com.rts.rts_backend.common.web.ApiResponse;
import com.rts.rts_backend.repository.dto.CreateRepositoryRequest;
import com.rts.rts_backend.repository.dto.RepositoryResponse;
import com.rts.rts_backend.repository.dto.UpdateRepositoryRequest;
import com.rts.rts_backend.repository.dto.ValidationResult;
import com.rts.rts_backend.repository.service.RepositoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing registered GitLab repositories.
 *
 * <p>All endpoints return the uniform {@link ApiResponse} envelope.
 */
@RestController
@RequestMapping("/api/v1/repositories")
public class RepositoryController {

    private final RepositoryService repositoryService;

    public RepositoryController(RepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    /**
     * Register a new GitLab project.
     *
     * @param request the project registration details (name, GitLab URL, token, etc.)
     * @return the created repository with HTTP 201
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RepositoryResponse>> create(
            @Valid @RequestBody CreateRepositoryRequest request,
            HttpServletRequest httpRequest) {

        RepositoryResponse response = repositoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(response, requestId(httpRequest)));
    }

    /**
     * List all registered repositories.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RepositoryResponse>>> getAll(
            HttpServletRequest httpRequest) {

        List<RepositoryResponse> repositories = repositoryService.getAll();
        return ResponseEntity.ok(
                ApiResponse.of(repositories, requestId(httpRequest), null, repositories.size()));
    }

    /**
     * Get a single repository by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RepositoryResponse>> getById(
            @PathVariable UUID id,
            HttpServletRequest httpRequest) {

        RepositoryResponse response = repositoryService.getById(id);
        return ResponseEntity.ok(ApiResponse.of(response, requestId(httpRequest)));
    }

    /**
     * Partially update a repository.
     * Only non-null fields in the request body are applied.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<RepositoryResponse>> update(
            @PathVariable UUID id,
            @RequestBody UpdateRepositoryRequest request,
            HttpServletRequest httpRequest) {

        RepositoryResponse response = repositoryService.update(id, request);
        return ResponseEntity.ok(ApiResponse.of(response, requestId(httpRequest)));
    }

    /**
     * Delete a registered repository.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        repositoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Validate the GitLab connection and permissions for a repository.
     *
     * <p>Checks: project access, repo read, MR read, pipeline read, artifact read.
     * Updates the repository's connection status accordingly.
     */
    @PostMapping("/{id}/validate")
    public ResponseEntity<ApiResponse<ValidationResult>> validate(
            @PathVariable UUID id,
            HttpServletRequest httpRequest) {

        ValidationResult result = repositoryService.validate(id);
        return ResponseEntity.ok(ApiResponse.of(result, requestId(httpRequest)));
    }

    /**
     * Sync repository metadata from GitLab (name, path, default branch).
     */
    @PostMapping("/{id}/sync")
    public ResponseEntity<ApiResponse<RepositoryResponse>> sync(
            @PathVariable UUID id,
            HttpServletRequest httpRequest) {

        RepositoryResponse response = repositoryService.sync(id);
        return ResponseEntity.ok(ApiResponse.of(response, requestId(httpRequest)));
    }

    // ---- Helper ----

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
