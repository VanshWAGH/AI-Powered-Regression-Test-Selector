package com.rts.rts_backend.mergerequest.service;

import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.mergerequest.dao.MergeRequestDao;
import com.rts.rts_backend.mergerequest.dto.MergeRequestResponse;
import com.rts.rts_backend.mergerequest.model.MergeRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MergeRequestServiceImpl implements MergeRequestService {

    private final MergeRequestDao mergeRequestDao;

    public MergeRequestServiceImpl(MergeRequestDao mergeRequestDao) {
        this.mergeRequestDao = mergeRequestDao;
    }

    @Override
    public MergeRequestResponse getById(UUID id) {
        MergeRequest mr = mergeRequestDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MergeRequest", id.toString()));
        return MergeRequestResponse.from(mr);
    }

    @Override
    public List<MergeRequestResponse> getByRepositoryId(UUID repositoryId) {
        return mergeRequestDao.findByRepositoryId(repositoryId).stream()
                .map(MergeRequestResponse::from)
                .toList();
    }
}
