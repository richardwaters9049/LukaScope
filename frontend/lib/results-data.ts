export type ExplainabilityKey = "gradient" | "guided_backprop" | "shap";

export type ResultHistoryEntry = {
    date: string;
    classification: "Positive" | "Negative";
    confidence: number;
};

export type ResultDetail = {
    id: string;
    sampleId: string;
    uploadedBy: string;
    date: string;
    classification: "Positive" | "Negative";
    confidence: number;
    totalCells: number;
    cellCounts: {
        normal: number;
        abnormal: number;
        lymphocytes: number;
        myeloblasts: number;
        neutrophils: number;
    };
    imageUrl: string;
    primaryExplainability: ExplainabilityKey;
    explainability: Record<ExplainabilityKey, string>;
    history: ResultHistoryEntry[];
    modelVersion: string;
};

export const resultsData: ResultDetail[] = [
    {
        id: "1",
        sampleId: "LS-00123",
        uploadedBy: "John Doe",
        date: "2025-12-16 09:18",
        classification: "Positive",
        confidence: 92,
        totalCells: 155,
        cellCounts: {
            normal: 120,
            abnormal: 35,
            lymphocytes: 50,
            myeloblasts: 30,
            neutrophils: 75,
        },
        imageUrl: "/images/sample_1P.png",
        primaryExplainability: "shap",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-11-20", classification: "Negative", confidence: 88 },
            { date: "2025-11-10", classification: "Negative", confidence: 91 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
    {
        id: "2",
        sampleId: "LS-00124",
        uploadedBy: "Jane Smith",
        date: "2025-12-15 10:12",
        classification: "Negative",
        confidence: 89,
        totalCells: 142,
        cellCounts: {
            normal: 132,
            abnormal: 10,
            lymphocytes: 60,
            myeloblasts: 12,
            neutrophils: 70,
        },
        imageUrl: "/images/sample_2N.png",
        primaryExplainability: "gradient",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-11-25", classification: "Negative", confidence: 90 },
            { date: "2025-11-15", classification: "Negative", confidence: 92 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
    {
        id: "3",
        sampleId: "LS-00125",
        uploadedBy: "Alice Johnson",
        date: "2025-12-14 15:42",
        classification: "Positive",
        confidence: 95,
        totalCells: 168,
        cellCounts: {
            normal: 121,
            abnormal: 47,
            lymphocytes: 54,
            myeloblasts: 39,
            neutrophils: 75,
        },
        imageUrl: "/images/sample_3P.png",
        primaryExplainability: "guided_backprop",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-12-01", classification: "Positive", confidence: 90 },
            { date: "2025-11-18", classification: "Negative", confidence: 86 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
    {
        id: "4",
        sampleId: "LS-00126",
        uploadedBy: "Bob Strike",
        date: "2025-10-24 08:03",
        classification: "Negative",
        confidence: 91,
        totalCells: 149,
        cellCounts: {
            normal: 136,
            abnormal: 13,
            lymphocytes: 48,
            myeloblasts: 14,
            neutrophils: 87,
        },
        imageUrl: "/images/sample_4N.png",
        primaryExplainability: "gradient",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-10-10", classification: "Negative", confidence: 88 },
            { date: "2025-09-28", classification: "Negative", confidence: 90 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
    {
        id: "5",
        sampleId: "LS-00127",
        uploadedBy: "Greg Apple",
        date: "2025-12-03 13:27",
        classification: "Positive",
        confidence: 87,
        totalCells: 151,
        cellCounts: {
            normal: 119,
            abnormal: 32,
            lymphocytes: 52,
            myeloblasts: 24,
            neutrophils: 75,
        },
        imageUrl: "/images/sample_5P.png",
        primaryExplainability: "shap",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-11-22", classification: "Positive", confidence: 84 },
            { date: "2025-11-07", classification: "Negative", confidence: 82 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
    {
        id: "6",
        sampleId: "LS-00128",
        uploadedBy: "Suzie Q",
        date: "2025-12-14 07:54",
        classification: "Negative",
        confidence: 90,
        totalCells: 146,
        cellCounts: {
            normal: 133,
            abnormal: 13,
            lymphocytes: 49,
            myeloblasts: 11,
            neutrophils: 86,
        },
        imageUrl: "/images/sample_6N.png",
        primaryExplainability: "guided_backprop",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-12-02", classification: "Negative", confidence: 89 },
            { date: "2025-11-12", classification: "Negative", confidence: 91 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
    {
        id: "7",
        sampleId: "LS-00129",
        uploadedBy: "Extra User",
        date: "2025-12-01 16:20",
        classification: "Positive",
        confidence: 93,
        totalCells: 160,
        cellCounts: {
            normal: 118,
            abnormal: 42,
            lymphocytes: 56,
            myeloblasts: 33,
            neutrophils: 71,
        },
        imageUrl: "/images/sample_1P.png",
        primaryExplainability: "shap",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png",
        },
        history: [
            { date: "2025-11-16", classification: "Positive", confidence: 88 },
            { date: "2025-11-03", classification: "Negative", confidence: 85 },
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2",
    },
];

export const resultsById: Record<string, ResultDetail> = Object.fromEntries(
    resultsData.map((result) => [result.id, result]),
);

