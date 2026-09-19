package com.rts.rts_backend.testreport.controller;

import com.rts.rts_backend.common.web.ApiResponse;
import com.rts.rts_backend.testreport.service.TestReportService;
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
@RequestMapping("/api/v1/repositories/{repositoryId}/test-reports")
public class TestReportController {

    private final TestReportService testReportService;

    public TestReportController(TestReportService testReportService) {
        this.testReportService = testReportService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, Integer>>> uploadJunitXml(
            @PathVariable UUID repositoryId,
            @RequestParam("commitSha") String commitSha,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        int ingestedCount = testReportService.uploadJunitXml(repositoryId, commitSha, file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(Map.of("ingestedTests", ingestedCount), requestId(request)));
    }

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
