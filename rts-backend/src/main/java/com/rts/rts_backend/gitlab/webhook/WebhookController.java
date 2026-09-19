package com.rts.rts_backend.gitlab.webhook;

import com.rts.rts_backend.common.exception.DuplicateEventException;
import com.rts.rts_backend.gitlab.model.GitLabMergeRequestEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/webhooks/gitlab")
public class WebhookController {

    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final WebhookService webhookService;

    public WebhookController(WebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @PostMapping("/{repositoryId}")
    public ResponseEntity<Void> receiveWebhook(
            @PathVariable UUID repositoryId,
            @RequestHeader(value = "X-Gitlab-Token", required = false) String gitlabToken,
            @RequestHeader(value = "X-Gitlab-Event", required = true) String eventType,
            @RequestHeader(value = "X-Gitlab-Event-UUID", required = true) String eventId,
            @RequestBody String rawPayload
    ) {
        log.info("Received GitLab webhook: type={}, eventId={}, repo={}", eventType, eventId, repositoryId);

        if (!"Merge Request Hook".equals(eventType)) {
            return ResponseEntity.ok().build();
        }

        try {
            GitLabMergeRequestEvent event = OBJECT_MAPPER.readValue(rawPayload, GitLabMergeRequestEvent.class);
            webhookService.processMergeRequestEvent(repositoryId, gitlabToken, eventId, rawPayload, event);
            return ResponseEntity.ok().build();
        } catch (DuplicateEventException e) {
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.warn("Webhook validation failed for repo {}: {}", repositoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.error("Failed to process webhook for repo {}", repositoryId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
