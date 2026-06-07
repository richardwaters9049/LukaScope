export type JobStatus = "queued" | "running" | "completed" | "failed";
export type Classification = "positive" | "negative" | "suspicious";
export type ReviewStatus = "pending" | "approved" | "rejected";

export type AnalysisJob = {
  id: string;
  sample_id: string;
  status: JobStatus;
  result_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type SampleCreated = {
  job_id: string;
  sample_id: string;
  status: JobStatus;
  result_id: string | null;
};

export type ResultSummary = {
  id: string;
  sample_id: string;
  sample_name: string;
  uploaded_by: string;
  uploaded_at: string;
  image_url: string;
  classification: Classification;
  confidence: number;
  model_version: string;
  heatmap_url: string;
  review_status: ReviewStatus;
  created_at: string;
};

export type ReviewPayload = {
  reviewer: string;
  label: Classification;
  approved_for_training: boolean;
  notes?: string;
};

const API_URL = "/backend-api";

export function backendAssetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("/assets/")) return path.replace(/^\/assets/, "/backend-assets");
  return path;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = init?.body instanceof FormData
    ? init.headers
    : init?.body
      ? { "Content-Type": "application/json", ...init?.headers }
      : init?.headers;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail ?? body.error ?? message;
    } catch {
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function uploadSample(file: File, uploadedBy = "clinician") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploaded_by", uploadedBy);
  return request<SampleCreated>("/api/samples", { method: "POST", body: formData });
}

export function fetchAnalysisJob(jobId: string) {
  return request<AnalysisJob>(`/api/analysis-jobs/${jobId}`, { cache: "no-store" });
}

export function fetchResults() {
  return request<ResultSummary[]>("/api/results", { cache: "no-store" });
}

export function fetchResult(resultId: string) {
  return request<ResultSummary>(`/api/results/${resultId}`, { cache: "no-store" });
}

export function submitReview(resultId: string, payload: ReviewPayload) {
  return request(`/api/results/${resultId}/review`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function displayClassification(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
