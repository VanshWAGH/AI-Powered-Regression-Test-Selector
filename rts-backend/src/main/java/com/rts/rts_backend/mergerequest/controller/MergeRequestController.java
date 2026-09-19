package com.rts.rts_backend.mergerequest.controller;

import com.rts.rts_backend.common.web.ApiResponse;
import com.rts.rts_backend.mergerequest.dto.MergeRequestResponse;
import com.rts.rts_backend.mergerequest.service.MergeRequestService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merge-requests")
public class MergeRequestController {

    private final MergeRequestService mergeRequestService;

    public MergeRequestController(MergeRequestService mergeRequestService) {
        this.mergeRequestService = mergeRequestService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MergeRequestResponse>> getById(
            @PathVariable UUID id,
            HttpServletRequest request) {
        MergeRequestResponse response = mergeRequestService.getById(id);
        return ResponseEntity.ok(ApiResponse.of(response, requestId(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MergeRequestResponse>>> getByRepositoryId(
            @RequestParam UUID repositoryId,
            HttpServletRequest request) {
        List<MergeRequestResponse> response = mergeRequestService.getByRepositoryId(repositoryId);
        return ResponseEntity.ok(ApiResponse.of(response, requestId(request), null, response.size()));
    }

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
