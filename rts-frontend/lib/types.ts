// ============================================================
// RTS Backend DTO Type Definitions
// Matches the Java backend models exactly.
// ============================================================

// ---- Enums ----

export type ConnectionStatus = 'PENDING' | 'CONNECTED' | 'FAILED' | 'DISCONNECTED';
export type BuildSystem = 'MAVEN' | 'GRADLE';
export type MergeRequestState = 'OPENED' | 'CLOSED' | 'MERGED';

// ---- Repository ----

export interface Repository {
  id: string;
  name: string;
  gitlabBaseUrl: string;
  gitlabProjectId: number;
  gitlabProjectPath: string | null;
  defaultBranch: string;
  buildSystem: BuildSystem;
  testFramework: string;
  connectionStatus: ConnectionStatus;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepositoryRequest {
  name: string;
  gitlabBaseUrl: string;
  gitlabProjectId: number;
  accessToken: string;
  buildSystem: BuildSystem;
  webhookSecret?: string;
}

export interface UpdateRepositoryRequest {
  name?: string;
  gitlabBaseUrl?: string;
  gitlabProjectId?: number;
  accessToken?: string;
  buildSystem?: BuildSystem;
  webhookSecret?: string;
}

export interface ValidationResult {
  repositoryId: string;
  connected: boolean;
  permissions: Record<string, boolean>;
  message: string;
}

// ---- Merge Request ----

export interface MergeRequest {
  id: string;
  repositoryId: string;
  gitlabIid: number;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  sourceCommitSha: string | null;
  targetCommitSha: string | null;
  authorUsername: string;
  state: MergeRequestState;
  webUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Recommendation ----

export interface RankedTest {
  className: string;
  methodName: string;
  score: number;
  recommended: boolean;
  signalBreakdown: Record<string, number>;
}

export interface TestRecommendation {
  mergeRequestId: string;
  repositoryId: string;
  totalTestsConsidered: number;
  recommendedCount: number;
  estimatedTimeReductionPct: number;
  rankedTests: RankedTest[];
}

// ---- Evaluation ----

export interface RecommendationEvaluation {
  id: string;
  pipelineRunId: string;
  repositoryId: string;
  totalTests: number;
  selectedTests: number;
  missedFailures: number;
  caughtFailures: number;
  recallPct: number | null;
  precisionPct: number | null;
  timeSavedSeconds: number | null;
  timeSavedPct: number | null;
  evaluatedAt: string;
}

export interface AggregateStats {
  evaluationCount: number;
  avgRecallPct: number | null;
  avgPrecisionPct: number | null;
  avgTimeSavedPct: number | null;
  totalTimeSavedSeconds: number | null;
}

// ---- API Envelope ----

export interface ApiMeta {
  requestId: string;
  timestamp?: string;
  nextCursor?: string;
  totalCount?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  requestId: string;
  status: number;
  code: string;
  message: string;
  details: string[];
  timestamp: string;
}
