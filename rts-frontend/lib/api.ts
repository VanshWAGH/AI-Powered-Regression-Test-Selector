import {
  Repository,
  CreateRepositoryRequest,
  MergeRequest,
  TestRecommendation,
  RecommendationEvaluation,
  AggregateStats,
  ValidationResult,
} from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Set to true to use mock data when backend is not running
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

/**
 * Generic fetch wrapper with error handling.
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `API request failed with status ${response.status}`);
  }

  return data.data as T;
}

// ============================================================
// Mock Data — realistic data matching backend DTOs exactly
// ============================================================

const MOCK_REPOSITORIES: Repository[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'orders-service',
    gitlabBaseUrl: 'https://gitlab.com',
    gitlabProjectId: 12345,
    gitlabProjectPath: 'acme-corp/orders-service',
    defaultBranch: 'main',
    buildSystem: 'GRADLE',
    testFramework: 'JUNIT5',
    connectionStatus: 'CONNECTED',
    lastSyncedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'payment-gateway',
    gitlabBaseUrl: 'https://gitlab.com',
    gitlabProjectId: 12346,
    gitlabProjectPath: 'acme-corp/payment-gateway',
    defaultBranch: 'main',
    buildSystem: 'MAVEN',
    testFramework: 'JUNIT5',
    connectionStatus: 'CONNECTED',
    lastSyncedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'user-auth-service',
    gitlabBaseUrl: 'https://gitlab.company.io',
    gitlabProjectId: 789,
    gitlabProjectPath: 'platform/user-auth',
    defaultBranch: 'develop',
    buildSystem: 'GRADLE',
    testFramework: 'JUNIT5',
    connectionStatus: 'PENDING',
    lastSyncedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'notification-engine',
    gitlabBaseUrl: 'https://gitlab.com',
    gitlabProjectId: 45678,
    gitlabProjectPath: 'acme-corp/notification-engine',
    defaultBranch: 'main',
    buildSystem: 'MAVEN',
    testFramework: 'JUNIT5',
    connectionStatus: 'FAILED',
    lastSyncedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const MOCK_MERGE_REQUESTS: MergeRequest[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    repositoryId: '550e8400-e29b-41d4-a716-446655440001',
    gitlabIid: 142,
    title: 'feat: Add order cancellation workflow with refund logic',
    sourceBranch: 'feature/order-cancel',
    targetBranch: 'main',
    sourceCommitSha: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    targetCommitSha: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5',
    authorUsername: 'alice.chen',
    state: 'OPENED',
    webUrl: 'https://gitlab.com/acme-corp/orders-service/-/merge_requests/142',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    repositoryId: '550e8400-e29b-41d4-a716-446655440001',
    gitlabIid: 141,
    title: 'fix: Race condition in inventory reservation handler',
    sourceBranch: 'bugfix/inventory-race',
    targetBranch: 'main',
    sourceCommitSha: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    targetCommitSha: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5',
    authorUsername: 'bob.martinez',
    state: 'MERGED',
    webUrl: 'https://gitlab.com/acme-corp/orders-service/-/merge_requests/141',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    repositoryId: '550e8400-e29b-41d4-a716-446655440002',
    gitlabIid: 89,
    title: 'refactor: Extract payment strategy pattern for multi-provider support',
    sourceBranch: 'refactor/payment-strategy',
    targetBranch: 'main',
    sourceCommitSha: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    targetCommitSha: 'e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4',
    authorUsername: 'carol.jones',
    state: 'OPENED',
    webUrl: 'https://gitlab.com/acme-corp/payment-gateway/-/merge_requests/89',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    repositoryId: '550e8400-e29b-41d4-a716-446655440001',
    gitlabIid: 140,
    title: 'chore: Upgrade Spring Boot to 4.1.1 and dependency refresh',
    sourceBranch: 'chore/spring-upgrade',
    targetBranch: 'main',
    sourceCommitSha: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    targetCommitSha: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5',
    authorUsername: 'alice.chen',
    state: 'CLOSED',
    webUrl: 'https://gitlab.com/acme-corp/orders-service/-/merge_requests/140',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    repositoryId: '550e8400-e29b-41d4-a716-446655440002',
    gitlabIid: 88,
    title: 'feat: Implement Stripe webhook handler with idempotency keys',
    sourceBranch: 'feature/stripe-webhooks',
    targetBranch: 'main',
    sourceCommitSha: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    targetCommitSha: 'e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4',
    authorUsername: 'dave.wilson',
    state: 'MERGED',
    webUrl: 'https://gitlab.com/acme-corp/payment-gateway/-/merge_requests/88',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const MOCK_RECOMMENDATION: TestRecommendation = {
  mergeRequestId: '660e8400-e29b-41d4-a716-446655440001',
  repositoryId: '550e8400-e29b-41d4-a716-446655440001',
  totalTestsConsidered: 248,
  recommendedCount: 47,
  estimatedTimeReductionPct: 68.5,
  rankedTests: [
    { className: 'OrderCancellationServiceTest', methodName: 'shouldCancelPendingOrder', score: 0.95, recommended: true, signalBreakdown: { 'Code Impact': 0.95, 'Failure History': 0.70, 'Coverage Overlap': 0.90, 'Package Proximity': 0.85, 'Recency': 0.60 } },
    { className: 'RefundCalculatorTest', methodName: 'shouldCalculatePartialRefund', score: 0.92, recommended: true, signalBreakdown: { 'Code Impact': 0.88, 'Failure History': 0.85, 'Coverage Overlap': 0.95, 'Package Proximity': 0.90, 'Recency': 0.40 } },
    { className: 'OrderCancellationServiceTest', methodName: 'shouldRejectCompletedOrderCancellation', score: 0.88, recommended: true, signalBreakdown: { 'Code Impact': 0.90, 'Failure History': 0.55, 'Coverage Overlap': 0.85, 'Package Proximity': 0.85, 'Recency': 0.75 } },
    { className: 'InventoryReservationTest', methodName: 'shouldReleaseReservationOnCancel', score: 0.85, recommended: true, signalBreakdown: { 'Code Impact': 0.80, 'Failure History': 0.60, 'Coverage Overlap': 0.92, 'Package Proximity': 0.70, 'Recency': 0.50 } },
    { className: 'PaymentRefundIntegrationTest', methodName: 'shouldProcessStripeRefund', score: 0.82, recommended: true, signalBreakdown: { 'Code Impact': 0.75, 'Failure History': 0.90, 'Coverage Overlap': 0.78, 'Package Proximity': 0.60, 'Recency': 0.85 } },
    { className: 'OrderEventPublisherTest', methodName: 'shouldPublishCancelledEvent', score: 0.78, recommended: true, signalBreakdown: { 'Code Impact': 0.85, 'Failure History': 0.40, 'Coverage Overlap': 0.80, 'Package Proximity': 0.75, 'Recency': 0.30 } },
    { className: 'NotificationServiceTest', methodName: 'shouldSendCancellationEmail', score: 0.65, recommended: true, signalBreakdown: { 'Code Impact': 0.60, 'Failure History': 0.55, 'Coverage Overlap': 0.70, 'Package Proximity': 0.50, 'Recency': 0.45 } },
    { className: 'OrderMapperTest', methodName: 'shouldMapToResponseDto', score: 0.15, recommended: false, signalBreakdown: { 'Code Impact': 0.10, 'Failure History': 0.05, 'Coverage Overlap': 0.20, 'Package Proximity': 0.90, 'Recency': 0.10 } },
    { className: 'HealthCheckTest', methodName: 'shouldReturnUp', score: 0.05, recommended: false, signalBreakdown: { 'Code Impact': 0.02, 'Failure History': 0.01, 'Coverage Overlap': 0.05, 'Package Proximity': 0.10, 'Recency': 0.05 } },
  ],
};

const MOCK_EVALUATIONS: RecommendationEvaluation[] = Array.from({ length: 20 }, (_, i) => ({
  id: `770e8400-e29b-41d4-a716-4466554400${String(i + 1).padStart(2, '0')}`,
  pipelineRunId: `880e8400-e29b-41d4-a716-4466554400${String(i + 1).padStart(2, '0')}`,
  repositoryId: '550e8400-e29b-41d4-a716-446655440001',
  totalTests: 200 + Math.floor(Math.random() * 60),
  selectedTests: 40 + Math.floor(Math.random() * 30),
  missedFailures: Math.random() > 0.85 ? 1 : 0,
  caughtFailures: 2 + Math.floor(Math.random() * 5),
  recallPct: 95 + Math.random() * 5,
  precisionPct: 60 + Math.random() * 30,
  timeSavedSeconds: 120 + Math.floor(Math.random() * 300),
  timeSavedPct: 55 + Math.random() * 30,
  evaluatedAt: new Date(Date.now() - 86400000 * (20 - i)).toISOString(),
}));

const MOCK_STATS: AggregateStats = {
  evaluationCount: 1204,
  avgRecallPct: 98.7,
  avgPrecisionPct: 72.3,
  avgTimeSavedPct: 64.8,
  totalTimeSavedSeconds: 45900,
};

// ============================================================
// API Functions — use mock data or live API
// ============================================================

// Small helper to simulate network latency in mock mode
function delay(ms: number = 300 + Math.random() * 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Repositories ----

export async function getRepositories(): Promise<Repository[]> {
  if (USE_MOCK) { await delay(); return MOCK_REPOSITORIES; }
  return fetchApi<Repository[]>('/repositories');
}

export async function getRepository(id: string): Promise<Repository> {
  if (USE_MOCK) { await delay(); return MOCK_REPOSITORIES.find(r => r.id === id) ?? MOCK_REPOSITORIES[0]; }
  return fetchApi<Repository>(`/repositories/${id}`);
}

export async function createRepository(request: CreateRepositoryRequest): Promise<Repository> {
  if (USE_MOCK) {
    await delay(800);
    const newRepo: Repository = {
      id: crypto.randomUUID(),
      name: request.name,
      gitlabBaseUrl: request.gitlabBaseUrl,
      gitlabProjectId: request.gitlabProjectId,
      gitlabProjectPath: null,
      defaultBranch: 'main',
      buildSystem: request.buildSystem,
      testFramework: 'JUNIT5',
      connectionStatus: 'PENDING',
      lastSyncedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_REPOSITORIES.push(newRepo);
    return newRepo;
  }
  return fetchApi<Repository>('/repositories', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function deleteRepository(id: string): Promise<void> {
  if (USE_MOCK) { await delay(); return; }
  await fetchApi(`/repositories/${id}`, { method: 'DELETE' });
}

export async function validateRepository(id: string): Promise<ValidationResult> {
  if (USE_MOCK) {
    await delay(1500);
    return {
      repositoryId: id,
      connected: true,
      permissions: {
        'project:read': true,
        'repository:read': true,
        'merge_request:read': true,
        'pipeline:read': true,
        'artifacts:read': true,
      },
      message: 'All permissions verified successfully.',
    };
  }
  return fetchApi<ValidationResult>(`/repositories/${id}/validate`, { method: 'POST' });
}

export async function syncRepository(id: string): Promise<Repository> {
  if (USE_MOCK) { await delay(1000); return MOCK_REPOSITORIES.find(r => r.id === id) ?? MOCK_REPOSITORIES[0]; }
  return fetchApi<Repository>(`/repositories/${id}/sync`, { method: 'POST' });
}

// ---- Merge Requests ----

export async function getMergeRequests(repositoryId?: string): Promise<MergeRequest[]> {
  if (USE_MOCK) {
    await delay();
    return repositoryId
      ? MOCK_MERGE_REQUESTS.filter(mr => mr.repositoryId === repositoryId)
      : MOCK_MERGE_REQUESTS;
  }
  const query = repositoryId ? `?repositoryId=${repositoryId}` : '';
  return fetchApi<MergeRequest[]>(`/merge-requests${query}`);
}

export async function getMergeRequest(id: string): Promise<MergeRequest> {
  if (USE_MOCK) { await delay(); return MOCK_MERGE_REQUESTS.find(mr => mr.id === id) ?? MOCK_MERGE_REQUESTS[0]; }
  return fetchApi<MergeRequest>(`/merge-requests/${id}`);
}

// ---- Recommendations ----

export async function generateRecommendation(mergeRequestId: string): Promise<TestRecommendation> {
  if (USE_MOCK) { await delay(2000); return { ...MOCK_RECOMMENDATION, mergeRequestId }; }
  return fetchApi<TestRecommendation>(`/recommendations/merge-requests/${mergeRequestId}`, { method: 'POST' });
}

// ---- Evaluations / Analytics ----

export async function getEvaluations(repositoryId: string): Promise<RecommendationEvaluation[]> {
  if (USE_MOCK) { await delay(); return MOCK_EVALUATIONS; }
  return fetchApi<RecommendationEvaluation[]>(`/evaluations/repositories/${repositoryId}`);
}

export async function getAggregateStats(repositoryId: string): Promise<AggregateStats> {
  if (USE_MOCK) { await delay(); return MOCK_STATS; }
  return fetchApi<AggregateStats>(`/evaluations/repositories/${repositoryId}/stats`);
}
