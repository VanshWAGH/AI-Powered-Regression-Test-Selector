# RTS Backend — Implementation Tasks

## Phase 1: Spring Foundation
- [/] Docker Compose for PostgreSQL
- [/] Update `build.gradle.kts` with new dependencies
- [/] Application configuration (`application.yml` + profiles)
- [/] Flyway migrations (`V1`, `V2`)
- [/] Common exceptions (`ApiError`, `ResourceNotFoundException`, `GitLabConnectionException`, `DuplicateEventException`)
- [/] Web infrastructure (`RequestIdFilter`, `ApiResponse`)
- [/] Utilities (`IdGenerator`, `TimeUtils`)
- [/] Config beans (`AsyncConfig`, `WebConfig`)
- [/] `GlobalExceptionHandler`
- [ ] Verify: app starts, health UP, Flyway runs, OpenAPI available

## Phase 2: Repository Management + GitLab Connection
- [ ] Domain models (`Repository`, `ConnectionStatus`, `BuildSystem`)
- [ ] DTOs (`CreateRepositoryRequest`, `UpdateRepositoryRequest`, `RepositoryResponse`, `ValidationResult`)
- [ ] `RepositoryDao` (Spring JDBC)
- [ ] GitLab client interface + REST implementation
- [ ] `GitLabProject` model
- [ ] `TokenEncryptionService`
- [ ] `RepositoryService` interface + implementation
- [ ] `RepositoryController`
- [ ] Verify: register repo, validate GitLab connection, list/get/update/delete repos

## Phase 3–10: Future Phases
- [ ] Phase 3: Merge Request Integration + Webhooks
- [ ] Phase 4: Git Diff + Code Analysis
- [ ] Phase 5: Test History Ingestion
- [ ] Phase 6: JaCoCo Coverage
- [ ] Phase 7: Recommendation Engine
- [ ] Phase 8: Pipeline + Job Tracking
- [ ] Phase 9: Evaluation + Analytics
- [ ] Phase 10: ML Integration
