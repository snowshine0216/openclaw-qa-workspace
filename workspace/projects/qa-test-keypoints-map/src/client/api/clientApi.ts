import type { SaveResult, TestKeyPointsDocument } from '../../shared/model/testKeyPointTypes';

export interface LoadResponse {
  sourcePath: string;
  featureId: string;
  document: TestKeyPointsDocument;
}

export interface SaveResponse {
  sourcePath: string;
  document: TestKeyPointsDocument;
  saveResult: SaveResult;
}

export async function loadFeatureDocument(featureId: string): Promise<LoadResponse> {
  const response = await fetch(`/api/features/${encodeURIComponent(featureId)}/test-key-points`);
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || `Failed to load ${featureId}`);
  }
  return (await response.json()) as LoadResponse;
}

export async function saveFeatureDocument(
  featureId: string,
  document: TestKeyPointsDocument,
): Promise<SaveResponse> {
  const response = await fetch(`/api/features/${encodeURIComponent(featureId)}/test-key-points`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ document }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || `Failed to save ${featureId}`);
  }

  return (await response.json()) as SaveResponse;
}
