import type { ResultSummary } from "@/lib/api";

export const demoResults: ResultSummary[] = [
  {
    id: "demo-sample-001",
    sample_id: "LKS-DEMO-001",
    sample_name: "Peripheral smear A",
    uploaded_by: "Dr. Rivera",
    uploaded_at: "2026-05-28T09:24:00.000Z",
    image_url: "/images/sample_1P_detected.png",
    classification: "suspicious",
    confidence: 94.2,
    model_version: "demo-vision-v1",
    heatmap_url: "/images/shap_heatmap.png",
    review_status: "pending",
    created_at: "2026-05-28T09:31:00.000Z",
  },
  {
    id: "demo-sample-002",
    sample_id: "LKS-DEMO-002",
    sample_name: "Peripheral smear B",
    uploaded_by: "Dr. Chen",
    uploaded_at: "2026-05-27T14:08:00.000Z",
    image_url: "/images/sample_2N_detected.png",
    classification: "negative",
    confidence: 91.6,
    model_version: "demo-vision-v1",
    heatmap_url: "/images/gradient_heatmap.png",
    review_status: "approved",
    created_at: "2026-05-27T14:16:00.000Z",
  },
  {
    id: "demo-sample-003",
    sample_id: "LKS-DEMO-003",
    sample_name: "Peripheral smear C",
    uploaded_by: "Dr. Morgan",
    uploaded_at: "2026-05-26T11:42:00.000Z",
    image_url: "/images/sample_3P_detected.png",
    classification: "positive",
    confidence: 88.9,
    model_version: "demo-vision-v1",
    heatmap_url: "/images/guided_backprop.png",
    review_status: "pending",
    created_at: "2026-05-26T11:49:00.000Z",
  },
  {
    id: "demo-sample-004",
    sample_id: "LKS-DEMO-004",
    sample_name: "Peripheral smear D",
    uploaded_by: "Dr. Patel",
    uploaded_at: "2026-05-25T16:15:00.000Z",
    image_url: "/images/sample_4N_detected.png",
    classification: "negative",
    confidence: 96.4,
    model_version: "demo-vision-v1",
    heatmap_url: "/images/shap_heatmap.png",
    review_status: "approved",
    created_at: "2026-05-25T16:22:00.000Z",
  },
  {
    id: "demo-sample-005",
    sample_id: "LKS-DEMO-005",
    sample_name: "Peripheral smear E",
    uploaded_by: "Dr. Silva",
    uploaded_at: "2026-05-24T10:03:00.000Z",
    image_url: "/images/sample_5P_detected.png",
    classification: "suspicious",
    confidence: 82.7,
    model_version: "demo-vision-v1",
    heatmap_url: "/images/gradient_heatmap.png",
    review_status: "pending",
    created_at: "2026-05-24T10:11:00.000Z",
  },
  {
    id: "demo-sample-006",
    sample_id: "LKS-DEMO-006",
    sample_name: "Peripheral smear F",
    uploaded_by: "Dr. Walker",
    uploaded_at: "2026-05-23T13:36:00.000Z",
    image_url: "/images/sample_6N_detected.png",
    classification: "negative",
    confidence: 93.8,
    model_version: "demo-vision-v1",
    heatmap_url: "/images/guided_backprop.png",
    review_status: "pending",
    created_at: "2026-05-23T13:44:00.000Z",
  },
];

export function getDemoResult(id: string) {
  return demoResults.find((result) => result.id === id);
}

export function isDemoResult(id: string) {
  return id.startsWith("demo-sample-");
}

export function getResultNeighbors(results: ResultSummary[], id: string) {
  const index = results.findIndex((result) => result.id === id);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: results[index - 1] ?? null,
    next: results[index + 1] ?? null,
  };
}
