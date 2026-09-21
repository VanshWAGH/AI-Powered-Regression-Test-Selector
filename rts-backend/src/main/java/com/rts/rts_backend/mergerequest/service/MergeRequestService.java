package com.rts.rts_backend.mergerequest.service;

import com.rts.rts_backend.mergerequest.dto.MergeRequestResponse;

import java.util.List;
import java.util.UUID;

public interface MergeRequestService {
    MergeRequestResponse getById(UUID id);
    List<MergeRequestResponse> getByRepositoryId(UUID repositoryId);
    List<MergeRequestResponse> getAll();
}
