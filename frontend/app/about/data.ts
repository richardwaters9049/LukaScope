import {
    SlidersHorizontal,
    Search,
    Brain,
    Eye,
    MessageSquare,
    Database,
    TrendingUp,
    BarChart3,
} from "lucide-react";

export const pipelineSteps = [
    {
        icon: SlidersHorizontal,
        title: "Preprocessing",
        description:
            "Stain normalisation, contrast adjustment, and resolution standardisation ensure consistent input quality.",
        colour: "text-sky-400",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
    },
    {
        icon: Search,
        title: "Cell Localisation",
        description:
            "Detection and segmentation isolate individual white blood cells and diagnostically relevant ROIs.",
        colour: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
    },
    {
        icon: Brain,
        title: "Classification",
        description:
            "Deep learning classifies each cell as normal or suspicious, outputting a confidence score per prediction.",
        colour: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    {
        icon: Eye,
        title: "Explainability",
        description:
            "SHAP and gradient heatmaps highlight the image regions that drove the model\u2019s decision.",
        colour: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
];

export const datasets = [
    {
        name: "C-NMC 2019 (TCIA)",
        tag: "Primary",
        tagColour: "bg-emerald-500/20 text-emerald-400",
        description:
            "Core ALL classification data from the ISBI 2019 challenge \u2014 labelled normal lymphocytes and malignant lymphoblasts.",
        href: "https://www.cancerimagingarchive.net/collection/c-nmc-2019/",
        linkText: "Cancer Imaging Archive",
    },
    {
        name: "ALL-IDB",
        tag: "Robustness",
        tagColour: "bg-blue-500/20 text-blue-400",
        description:
            "Whole-image and cropped-cell microscopy variants that strengthen model generalisation across imaging conditions.",
        href: "https://scotti.di.unimi.it/all/",
        linkText: "University of Milan",
    },
    {
        name: "Raabin-WBC",
        tag: "Pretraining",
        tagColour: "bg-violet-500/20 text-violet-400",
        description:
            "Large-scale WBC morphology data for representation learning and domain adaptation before ALL fine-tuning.",
        href: "https://www.raabindata.com/free-data/",
        linkText: "Raabin Data",
    },
];

export const trainingSteps = [
    { step: "01", title: "Ingest", description: "Load and validate datasets via source-specific hooks" },
    { step: "02", title: "Normalise", description: "Standardise stain, contrast, and illumination" },
    { step: "03", title: "Augment", description: "Rotation, flipping, colour jitter, and class balancing" },
    { step: "04", title: "Train", description: "Fine-tune CNN/ViT backbones with transfer learning" },
    { step: "05", title: "Evaluate", description: "Recall-first metrics, AUROC, calibration checks" },
    { step: "06", title: "Explain", description: "Generate SHAP and gradient-guided heatmaps" },
];

export const improvementCards = [
    {
        icon: MessageSquare,
        title: "Clinician Feedback",
        description: "Corrected predictions feed back as high-quality ground truth annotations.",
        colour: "text-sky-400",
    },
    {
        icon: Database,
        title: "New Data Integration",
        description: "Additional public and institutional datasets expand morphological coverage.",
        colour: "text-violet-400",
    },
    {
        icon: TrendingUp,
        title: "Cross-Domain Validation",
        description: "Performance tracked across dataset domains to detect drift early.",
        colour: "text-emerald-400",
    },
    {
        icon: BarChart3,
        title: "Metric Monitoring",
        description: "Sensitivity, calibration, and false-negative rates trigger retraining when needed.",
        colour: "text-amber-400",
    },
];

export const references = [
    {
        title: "C-NMC 2019",
        subtitle: "ISBI 2019 ALL challenge dataset",
        href: "https://www.cancerimagingarchive.net/collection/c-nmc-2019/",
    },
    {
        title: "ALL-IDB",
        subtitle: "University of Milan microscopy dataset",
        href: "https://scotti.di.unimi.it/all/",
    },
    {
        title: "Raabin-WBC",
        subtitle: "Large-scale WBC morphology data",
        href: "https://www.raabindata.com/free-data/",
    },
    {
        title: "Topol (2019) \u2014 Nature Medicine",
        subtitle: "AI in clinical practice review",
        href: "https://www.nature.com/articles/s41591-019-0508-1",
    },
    {
        title: "Leukaemia Foundation",
        subtitle: "Clinical overview of ALL",
        href: "https://www.leukaemia.org.au/blood-cancer/leukaemia/acute-lymphoblastic-leukaemia/",
    },
    {
        title: "SHAP Documentation",
        subtitle: "Model explainability framework",
        href: "https://shap.readthedocs.io/en/latest/",
    },
    {
        title: "PyTorch",
        subtitle: "Deep learning training framework",
        href: "https://pytorch.org/",
    },
    {
        title: "Ultralytics YOLO",
        subtitle: "Object detection for cell localisation",
        href: "https://docs.ultralytics.com/",
    },
];
