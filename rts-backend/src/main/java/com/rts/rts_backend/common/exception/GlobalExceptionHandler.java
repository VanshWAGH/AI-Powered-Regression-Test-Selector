package com.rts.rts_backend.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.List;

/**
 * Centralised exception handler that maps domain exceptions to uniform
 * {@link ApiError} responses. Every API error passes through here so
 * clients always receive a predictable JSON shape.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ---- Domain exceptions ----

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex,
                                                    HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiError.of(requestId(request), 404, "NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(GitLabConnectionException.class)
    public ResponseEntity<ApiError> handleGitLabConnection(GitLabConnectionException ex,
                                                            HttpServletRequest request) {
        log.error("GitLab connection error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(ApiError.of(requestId(request), 502, "GITLAB_CONNECTION_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(DuplicateEventException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateEventException ex,
                                                     HttpServletRequest request) {
        log.info("Duplicate event ignored: {}", ex.getEventKey());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiError.of(requestId(request), 409, "DUPLICATE_EVENT", ex.getMessage()));
    }

    // ---- Validation exceptions ----

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                      HttpServletRequest request) {
        List<ApiError.FieldError> details = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new ApiError.FieldError(e.getField(), e.getDefaultMessage()))
                .toList();
        log.warn("Validation failed: {} error(s)", details.size());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiError.of(requestId(request), 400, "VALIDATION_ERROR",
                        "Request validation failed", details));
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiError> handleMethodValidation(HandlerMethodValidationException ex,
                                                            HttpServletRequest request) {
        log.warn("Method validation failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiError.of(requestId(request), 400, "VALIDATION_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex,
                                                           HttpServletRequest request) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiError.of(requestId(request), 400, "BAD_REQUEST", ex.getMessage()));
    }

    // ---- Catch-all ----

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneral(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error on request {}", requestId(request), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of(requestId(request), 500, "INTERNAL_ERROR",
                        "An unexpected error occurred"));
    }

    // ---- Helper ----

    private static String requestId(HttpServletRequest request) {
        Object id = request.getAttribute("requestId");
        return id != null ? id.toString() : "unknown";
    }
}
