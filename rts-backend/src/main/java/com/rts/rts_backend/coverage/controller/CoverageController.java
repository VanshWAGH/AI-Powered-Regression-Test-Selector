package com.rts.rts_backend.coverage.controller;

import com.rts.rts_backend.common.web.ApiResponse;
import com.rts.rts_backend.coverage.service.CoverageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/repositories/{repositoryId}/coverage")
public class CoverageController {

    private final CoverageService coverageService;

    public CoverageController(CoverageService coverageService) {
        this.coverageService = coverageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadJacocoReport(
            @PathVariable UUID repositoryId,
            @RequestParam("commitSha") String commitSha,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        int methodCount = coverageService.uploadJacocoXml(repositoryId, commitSha, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(Map.of("methodsIngested", methodCount), requestId(request)));
    }

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
