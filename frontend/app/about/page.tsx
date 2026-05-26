"use client";

import Nav from "@/components/ui/nav";
import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";
import {
    Microscope,
    Brain,
    Database,
    Sparkles,
    ArrowRight,
    ExternalLink,
    ShieldCheck,
    RefreshCw,
    MessageSquare,
    TrendingUp,
    BarChart3,
    Layers,
    Search,
    SlidersHorizontal,
    Eye,
} from "lucide-react";

const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: cubicBezier(0.25, 0.1, 0.25, 1),
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: cubicBezier(0.25, 0.1, 0.25, 1),
        },
    },
};

const pipelineSteps = [
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

const datasets = [
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

const trainingSteps = [
    { step: "01", title: "Ingest", description: "Load and validate datasets via source-specific hooks" },
    { step: "02", title: "Normalise", description: "Standardise stain, contrast, and illumination" },
    { step: "03", title: "Augment", description: "Rotation, flipping, colour jitter, and class balancing" },
    { step: "04", title: "Train", description: "Fine-tune CNN/ViT backbones with transfer learning" },
    { step: "05", title: "Evaluate", description: "Recall-first metrics, AUROC, calibration checks" },
    { step: "06", title: "Explain", description: "Generate SHAP and gradient-guided heatmaps" },
];

const improvementCards = [
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

const references = [
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

export default function AboutPage() {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={pageVariants}
            className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
        >
            <Nav />

            <main className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-4 py-10 md:px-8">
                {/* Header */}
                <motion.header
                    variants={itemVariants}
                    className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold tracking-tight">
                            About LukaScope
                        </h1>
                        <p className="max-w-2xl text-lg text-slate-300">
                            AI-powered blood smear analysis to help clinicians detect potential
                            leukaemia earlier, faster, and more consistently.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                    >
                        &larr; Back to Dashboard
                    </Link>
                </motion.header>

                {/* What is LukaScope — hero cards */}
                <motion.section variants={itemVariants} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                            <Microscope className="h-5 w-5 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            What is LukaScope?
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 space-y-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                                <ShieldCheck className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-white">Clinical Decision Support</h3>
                            <p className="text-sm leading-6 text-slate-300">
                                Pairs deep learning computer vision with a clinician-friendly
                                interface. Designed to assist&mdash;not replace&mdash;qualified
                                haematologists and pathologists.
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 space-y-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                                <Sparkles className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h3 className="font-semibold text-white">Confidence &amp; Transparency</h3>
                            <p className="text-sm leading-6 text-slate-300">
                                Every prediction includes a confidence score and explainability
                                heatmaps so clinicians can see exactly why a sample was flagged.
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 space-y-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
                                <Layers className="h-5 w-5 text-violet-400" />
                            </div>
                            <h3 className="font-semibold text-white">ALL Screening</h3>
                            <p className="text-sm leading-6 text-slate-300">
                                Screens peripheral blood smear images for morphological indicators
                                of Acute Lymphoblastic Leukaemia (ALL) to support earlier detection.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Detection Pipeline */}
                <motion.section variants={itemVariants} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Brain className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            How LukaScope Detects Leukaemia
                        </h2>
                    </div>

                    <p className="text-sm leading-7 text-slate-300 max-w-3xl">
                        Malignant lymphoblasts exhibit distinct features&mdash;enlarged nuclei,
                        high nucleus-to-cytoplasm ratio, irregular chromatin. LukaScope automates
                        initial screening using CNNs and Vision Transformers trained to recognise
                        these abnormalities at scale.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {pipelineSteps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                variants={itemVariants}
                                className={`rounded-lg border ${step.border} ${step.bg} p-5 space-y-3 relative`}
                            >
                                <div className="flex items-center justify-between">
                                    <step.icon className={`h-6 w-6 ${step.colour}`} />
                                    <span className="text-xs font-mono text-slate-500">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-white">{step.title}</h3>
                                <p className="text-sm leading-6 text-slate-300">
                                    {step.description}
                                </p>
                                {i < pipelineSteps.length - 1 && (
                                    <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Training Data Sources */}
                <motion.section variants={itemVariants} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                            <Database className="h-5 w-5 text-violet-400" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Training Data Sources
                        </h2>
                    </div>

                    <p className="text-sm leading-7 text-slate-300 max-w-3xl">
                        Models are trained on publicly available, peer-reviewed medical imaging
                        datasets. Multiple sources improve generalisation across staining
                        protocols, microscope types, and patient populations.
                    </p>

                    <div className="grid gap-4 md:grid-cols-3">
                        {datasets.map((ds) => (
                            <motion.div
                                key={ds.name}
                                variants={itemVariants}
                                className="rounded-lg border border-white/10 bg-slate-900/70 p-5 flex flex-col gap-3"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-white">{ds.name}</h3>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ds.tagColour}`}
                                    >
                                        {ds.tag}
                                    </span>
                                </div>
                                <p className="text-sm leading-6 text-slate-300 flex-1">
                                    {ds.description}
                                </p>
                                <a
                                    href={ds.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    {ds.linkText}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How the AI is Trained */}
                <motion.section variants={itemVariants} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">
                            <Sparkles className="h-5 w-5 text-sky-400" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            How the AI Is Trained
                        </h2>
                    </div>

                    <p className="text-sm leading-7 text-slate-300 max-w-3xl">
                        Training runs in a dedicated Python environment (PyTorch + Ultralytics
                        YOLO), separate from the production stack. The pipeline follows six
                        clearly defined stages:
                    </p>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {trainingSteps.map((ts) => (
                            <motion.div
                                key={ts.step}
                                variants={itemVariants}
                                className="rounded-lg border border-white/10 bg-slate-900/70 p-4 flex items-start gap-4"
                            >
                                <span className="text-2xl font-bold text-slate-700 font-mono leading-none mt-0.5">
                                    {ts.step}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">
                                        {ts.title}
                                    </h3>
                                    <p className="text-sm leading-6 text-slate-400 mt-1">
                                        {ts.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Continuous Improvement */}
                <motion.section variants={itemVariants} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                            <RefreshCw className="h-5 w-5 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Continuous Improvement
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {improvementCards.map((card) => (
                            <motion.div
                                key={card.title}
                                variants={itemVariants}
                                className="rounded-lg border border-white/10 bg-slate-900/70 p-5 flex items-start gap-4"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
                                    <card.icon className={`h-5 w-5 ${card.colour}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{card.title}</h3>
                                    <p className="text-sm leading-6 text-slate-300 mt-1">
                                        {card.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* References */}
                <motion.section variants={itemVariants} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50">
                            <ExternalLink className="h-5 w-5 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            References &amp; Further Reading
                        </h2>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {references.map((ref) => (
                            <a
                                key={ref.title}
                                href={ref.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group rounded-lg border border-white/10 bg-slate-900/70 p-4 flex items-center justify-between gap-3 hover:border-blue-500/30 hover:bg-slate-900/90 transition-all"
                            >
                                <div>
                                    <p className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">
                                        {ref.title}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">{ref.subtitle}</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors" />
                            </a>
                        ))}
                    </div>
                </motion.section>

                {/* Disclaimer */}
                <motion.section variants={itemVariants}>
                    <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                            <ShieldCheck className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-400 mb-1">
                                Clinical Disclaimer
                            </p>
                            <p className="text-sm leading-7 text-slate-300">
                                LukaScope is a decision-support tool intended to assist qualified
                                medical professionals. It does not provide diagnoses. All
                                predictions must be reviewed and confirmed by a licensed clinician
                                before any clinical action is taken. Model outputs should always be
                                interpreted in the context of the full clinical picture.
                            </p>
                        </div>
                    </div>
                </motion.section>
            </main>
        </motion.div>
    );
}
