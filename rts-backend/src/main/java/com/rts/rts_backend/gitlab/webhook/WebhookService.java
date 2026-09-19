package com.rts.rts_backend.gitlab.webhook;

import java.util.UUID;

public interface WebhookService {
    void processMergeRequestEvent(UUID repositoryId, String gitlabToken, String eventId, String payloadJson, com.rts.rts_backend.gitlab.model.GitLabMergeRequestEvent event);
}
