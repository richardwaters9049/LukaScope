"use client";

import Nav from "@/components/ui/nav";
import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";

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

export default function AboutPage() {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={pageVariants}
            className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
        >
            <Nav />

            <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:px-8">
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
                            leukemia earlier, faster, and more consistently.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </motion.header>

                {/* What is LukaScope */}
                <motion.section variants={itemVariants} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        What is LukaScope?
                    </h2>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300 space-y-4">
                        <p>
                            LukaScope is a clinical decision-support platform that pairs deep
                            learning computer vision with an intuitive, clinician-friendly
                            interface. It is designed to assist&mdash;not replace&mdash;qualified
                            haematologists and pathologists by screening peripheral blood smear
                            images for morphological indicators of Acute Lymphoblastic Leukaemia
                            (ALL).
                        </p>
                        <p>
                            The platform provides confidence-scored predictions, explainability
                            heatmaps, and structured result summaries so clinicians can review
                            flagged samples quickly and make informed decisions with full
                            transparency into the model&apos;s reasoning.
                        </p>
                    </div>
                </motion.section>

                {/* How Detection Works */}
                <motion.section variants={itemVariants} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        How LukaScope Detects Leukaemia
                    </h2>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300 space-y-4">
                        <p>
                            Blood smear microscopy is a cornerstone of leukaemia diagnosis. In
                            ALL, malignant lymphoblasts proliferate in the bone marrow and
                            peripheral blood. These abnormal cells exhibit distinct morphological
                            features&mdash;enlarged nuclei, high nucleus-to-cytoplasm ratio,
                            irregular chromatin patterns, and visible nucleoli&mdash;that
                            experienced pathologists identify under the microscope.
                        </p>
                        <p>
                            LukaScope automates the initial screening step using deep
                            convolutional neural networks (CNNs) and Vision Transformers (ViTs)
                            trained to recognise these cellular abnormalities at scale. The
                            detection pipeline follows these stages:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>
                                <strong className="text-white">Image preprocessing</strong> &mdash;
                                Uploaded smear images undergo stain normalisation, contrast
                                adjustment, and resolution standardisation to ensure consistent
                                input quality regardless of the source microscope or slide
                                preparation.
                            </li>
                            <li>
                                <strong className="text-white">Cell localisation</strong> &mdash;
                                A detection/segmentation stage isolates individual white blood
                                cells and diagnostically relevant regions of interest (ROIs)
                                from the full slide image.
                            </li>
                            <li>
                                <strong className="text-white">Classification</strong> &mdash;
                                Each isolated cell is classified as normal or suspicious/malignant
                                by a deep learning backbone trained on labelled ALL datasets.
                                The model outputs a confidence score for every prediction.
                            </li>
                            <li>
                                <strong className="text-white">Explainability overlay</strong> &mdash;
                                SHAP values and gradient-based heatmaps highlight the regions of
                                the image that most influenced the model&apos;s decision, giving
                                clinicians a visual explanation alongside each result.
                            </li>
                        </ol>
                    </div>
                </motion.section>

                {/* Training Data Sources */}
                <motion.section variants={itemVariants} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Training Data Sources
                    </h2>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300 space-y-6">
                        <p>
                            LukaScope&apos;s models are trained on publicly available, peer-reviewed
                            medical imaging datasets. Using multiple sources improves
                            generalisation across different staining protocols, microscope types,
                            and patient populations.
                        </p>

                        <div className="space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-white">
                                    C-NMC 2019 (TCIA)
                                </h3>
                                <p>
                                    The primary dataset for ALL-focused baseline training. Released
                                    as part of the ISBI 2019 challenge, it contains labelled
                                    microscopy images of normal lymphocytes and malignant
                                    lymphoblasts from confirmed ALL patients. This dataset drives
                                    the core binary classification task (normal vs. malignant).
                                </p>
                                <a
                                    href="https://www.cancerimagingarchive.net/collection/c-nmc-2019/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Cancer Imaging Archive &mdash; C-NMC 2019 Collection
                                </a>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-white">
                                    ALL-IDB (ALL-IDB1 / ALL-IDB2)
                                </h3>
                                <p>
                                    An additional ALL-focused microscopy dataset providing both
                                    whole-image views and cropped single-cell variants. It
                                    strengthens model robustness by exposing training to different
                                    imaging conditions and is suitable for both classification and
                                    region-of-interest analysis.
                                </p>
                                <a
                                    href="https://scotti.di.unimi.it/all/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    ALL-IDB &mdash; Acute Lymphoblastic Leukaemia Image Database
                                </a>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-white">
                                    Raabin-WBC
                                </h3>
                                <p>
                                    A large white blood cell morphology dataset used for
                                    representation learning and domain adaptation. By pretraining
                                    on diverse WBC imagery, the model learns robust cellular
                                    features before fine-tuning on ALL-specific labels, improving
                                    performance on edge cases and rare morphologies.
                                </p>
                                <a
                                    href="https://www.raabindata.com/free-data/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Raabin-WBC &mdash; Free Data
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* How the AI is Trained */}
                <motion.section variants={itemVariants} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        How the AI Is Trained
                    </h2>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300 space-y-4">
                        <p>
                            Training takes place in a dedicated Python environment (PyTorch +
                            Ultralytics YOLO) separate from the production application stack.
                            The pipeline is structured into clearly separated stages:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>
                                <strong className="text-white">Dataset ingestion</strong> &mdash;
                                Source-specific hooks load and validate images from each dataset,
                                building a versioned registry with provenance metadata.
                            </li>
                            <li>
                                <strong className="text-white">Stain &amp; illumination normalisation</strong> &mdash;
                                Preprocessing functions standardise colour balance and contrast
                                across images from different laboratories and microscopes.
                            </li>
                            <li>
                                <strong className="text-white">Augmentation &amp; balancing</strong> &mdash;
                                Controlled augmentations (rotation, flipping, colour jitter,
                                Albumentations transforms) and class-balancing strategies ensure
                                the model does not overfit to any single data distribution.
                            </li>
                            <li>
                                <strong className="text-white">Transfer learning</strong> &mdash;
                                Deep CNN and Vision Transformer backbones pretrained on large-scale
                                image datasets are fine-tuned on the ALL-specific classification
                                task, accelerating convergence and improving accuracy on limited
                                medical data.
                            </li>
                            <li>
                                <strong className="text-white">Evaluation</strong> &mdash;
                                Models are evaluated with a recall-first strategy, prioritising
                                sensitivity to catch suspicious cases early. Additional metrics
                                include precision, AUROC, F1, calibration error, and
                                false-negative rate. Patient-level splits prevent data leakage
                                between training and validation sets.
                            </li>
                            <li>
                                <strong className="text-white">Explainability generation</strong> &mdash;
                                SHAP values and gradient-guided heatmaps are computed for each
                                prediction, providing interpretable visual evidence that clinicians
                                can review alongside the raw image.
                            </li>
                        </ol>
                    </div>
                </motion.section>

                {/* How the AI Improves */}
                <motion.section variants={itemVariants} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Continuous Improvement
                    </h2>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300 space-y-4">
                        <p>
                            LukaScope is designed for iterative improvement through a continuous
                            learning loop:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li>
                                <strong className="text-white">Clinician feedback</strong> &mdash;
                                When a pathologist reviews and corrects a model prediction, that
                                labelled sample feeds back into the training pipeline as a
                                high-quality ground truth annotation.
                            </li>
                            <li>
                                <strong className="text-white">New data integration</strong> &mdash;
                                As additional public or institutional datasets become available,
                                they are ingested through the same versioned pipeline, expanding
                                the model&apos;s exposure to diverse morphologies and edge cases.
                            </li>
                            <li>
                                <strong className="text-white">Cross-domain validation</strong> &mdash;
                                Performance is tracked across dataset domains to measure
                                generalisation and detect drift. Models that degrade on new
                                data distributions are retrained with updated samples.
                            </li>
                            <li>
                                <strong className="text-white">Metric tracking</strong> &mdash;
                                Sensitivity, specificity, calibration, and false-negative rates
                                are monitored over time. Any regression triggers a retraining
                                cycle before the updated model is promoted to production.
                            </li>
                        </ul>
                    </div>
                </motion.section>

                {/* References */}
                <motion.section variants={itemVariants} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        References &amp; Further Reading
                    </h2>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300 space-y-3">
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://www.cancerimagingarchive.net/collection/c-nmc-2019/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    C-NMC 2019 &mdash; The Cancer Imaging Archive
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; ISBI 2019 ALL classification challenge dataset
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://scotti.di.unimi.it/all/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    ALL-IDB &mdash; Acute Lymphoblastic Leukaemia Image Database
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; University of Milan microscopy dataset
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://www.raabindata.com/free-data/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Raabin-WBC &mdash; White Blood Cell Dataset
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; Large-scale WBC morphology data for pretraining
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://www.nature.com/articles/s41591-019-0508-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Topol, E.J. (2019) &mdash; High-performance medicine: the
                                    convergence of human and artificial intelligence
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; Nature Medicine review on AI in clinical practice
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://www.leukaemia.org.au/blood-cancer/leukaemia/acute-lymphoblastic-leukaemia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Leukaemia Foundation &mdash; About Acute Lymphoblastic Leukaemia
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; Clinical overview of ALL for patients and carers
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://shap.readthedocs.io/en/latest/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    SHAP (SHapley Additive exPlanations)
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; Explainability framework used for model interpretability
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://pytorch.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    PyTorch
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; Deep learning framework powering LukaScope&apos;s training pipeline
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://docs.ultralytics.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Ultralytics YOLO
                                </a>
                                <span className="text-slate-400">
                                    {" "}&mdash; Object detection models used for cell localisation
                                </span>
                            </li>
                        </ul>
                    </div>
                </motion.section>

                {/* Disclaimer */}
                <motion.section variants={itemVariants}>
                    <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-6 text-sm leading-7 text-slate-300">
                        <p className="font-semibold text-amber-400 mb-2">Clinical Disclaimer</p>
                        <p>
                            LukaScope is a decision-support tool intended to assist qualified
                            medical professionals. It does not provide diagnoses. All predictions
                            must be reviewed and confirmed by a licensed clinician before any
                            clinical action is taken. Model outputs should always be interpreted
                            in the context of the full clinical picture.
                        </p>
                    </div>
                </motion.section>
            </main>
        </motion.div>
    );
}
