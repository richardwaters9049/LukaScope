"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/ui/nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Activity, Brain, Database, Microscope, ScanLine, ShieldCheck } from "lucide-react";
import AnalysisOverlay from "@/components/overlay";
import Image from "next/image";
import { uploadSample } from "@/lib/api";

const analysisPathway = [
    { label: "Smear scan", detail: "Image quality", icon: ScanLine, colour: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Cell review", detail: "Morphology", icon: Microscope, colour: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "AI signal", detail: "Confidence", icon: Brain, colour: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Clinician gate", detail: "Review label", icon: ShieldCheck, colour: "text-amber-400", bg: "bg-amber-500/10" },
];

const platformSignals = [
    { label: "Backend API", detail: "FastAPI", icon: Activity, colour: "text-sky-400", bg: "bg-sky-500/10" },
    { label: "Result store", detail: "Postgres", icon: Database, colour: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "AI worker", detail: "Redis queue", icon: Brain, colour: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Review loop", detail: "Clinician labels", icon: ShieldCheck, colour: "text-amber-400", bg: "bg-amber-500/10" },
];

const uploadSteps = [
    { label: "Upload", dot: "bg-yellow-300", gradient: "from-yellow-200 to-amber-400" },
    { label: "Analyse", dot: "bg-emerald-300", gradient: "from-emerald-200 to-green-400" },
    { label: "Review", dot: "bg-sky-300", gradient: "from-sky-200 to-blue-400" },
];

export default function DashboardPage() {
    const router = useRouter();
    const [analysing, setAnalysing] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const isAllowedFile = (f: File) => {
        if (["image/jpeg", "image/png", "image/tiff"].includes(f.type)) return true;
        return /\.(jpe?g|png|tiff?)$/i.test(f.name);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please choose a sample file before submitting.");
            return;
        }

        if (!isAllowedFile(file)) {
            setError("Unsupported format. Use JPG, PNG, or TIFF.");
            return;
        }

        setError("");
        setJobId(null);

        try {
            const created = await uploadSample(file);
            setJobId(created.job_id);
            setAnalysing(true);
            if (created.status === "completed" && created.result_id) {
                router.push(`/results/${created.result_id}`);
            }
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
            setAnalysing(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            <Nav />

            <section className="mx-auto w-full max-w-7xl tracking-wider px-4 py-10 md:px-8">
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
                    {/* ======================
                        SUMMARY PANEL
                    ====================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full"
                    >
                        <Card className="h-full border-white/10 bg-slate-950/60 text-white shadow-2xl">
                            <CardTitle className="flex items-center gap-2 whitespace-normal text-3xl tracking-tight text-white sm:whitespace-nowrap lg:text-3xl xl:text-4xl">
                                Welcome to LukaScope
                            </CardTitle>

                            <CardDescription className="text-slate-200">
                                LukaScope is an AI-powered blood sample analysis platform
                                designed to assist clinicians and laboratory professionals in
                                identifying potential indicators of leukaemia.
                            </CardDescription>

                            <CardDescription className="text-slate-200">
                                Users securely upload blood smear samples, which are processed
                                by our computer vision and machine learning models to classify
                                samples, estimate confidence, and extract detailed cell
                                statistics.
                            </CardDescription>

                            <CardDescription className="text-slate-200">
                                The demo now runs through a Python FastAPI analysis backend,
                                Redis worker queue, Postgres metadata layer, and explainability
                                artifacts for a production-shaped workflow.
                            </CardDescription>

                            <CardDescription className="text-slate-200">
                                Each uploaded sample is linked to the authenticated user,
                                allowing results, history, and AI explainability outputs to be
                                reviewed clearly and consistently.
                            </CardDescription>

                            <div className="grid grid-cols-3 gap-3 pt-2">
                                {[
                                    ["6", "Demo results"],
                                    ["96%", "Top confidence"],
                                    ["24h", "Review window"],
                                ].map(([value, label]) => (
                                    <div key={label} className="rounded-md border border-white/10 bg-white/5 p-3">
                                        <div className="text-2xl font-semibold">{value}</div>
                                        <div className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-base font-semibold text-white">Platform signals</p>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Production-shaped demo</p>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.8)]" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {platformSignals.map((signal) => (
                                        <div key={signal.label} className="rounded-md border border-white/10 bg-white/5 p-3">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${signal.bg}`}>
                                                    <signal.icon className={`h-4 w-4 ${signal.colour}`} />
                                                </div>
                                                <div className="h-px flex-1 bg-linear-to-r from-white/20 to-transparent" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">{signal.label}</p>
                                            <p className="text-xs text-slate-400">{signal.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* ======================
                        UPLOAD PANEL
                    ====================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className="h-full"
                    >
                        <Card className="flex h-full flex-col gap-4 border-white/10 bg-slate-950/60 text-white shadow-2xl">
                            <CardTitle className="flex items-center gap-2 text-white">
                                Upload Sample
                            </CardTitle>

                            <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.tif,.tiff"
                                className="cursor-pointer border-white/10 bg-slate-900/70 text-white file:text-white"
                                disabled={analysing}
                                onChange={(e) => {
                                    const selected = e.target.files?.[0] ?? null;
                                    setFile(selected);
                                    setJobId(null);
                                    setError("");
                                }}
                            />

                            <div className="submit-btn flex justify-center my-5">
                                <Button
                                    className="flex items-center gap-2 transition-transform hover:scale-102 active:scale-95 w-1/2"
                                    onClick={handleUpload}
                                    disabled={analysing}
                                >
                                    <ArrowUpTrayIcon className="h-4 w-4" />
                                    {analysing ? "Analysing..." : "Submit"}
                                </Button>
                            </div>

                            {error && (
                                <CardDescription className="text-sm text-red-400">
                                    {error}
                                </CardDescription>
                            )}

                            <CardDescription className="text-sm text-slate-200">
                                Upload a blood smear image to begin AI analysis.
                            </CardDescription>
                            <CardDescription className="text-xs text-slate-400">
                                Supported formats: JPG, PNG, TIFF.
                            </CardDescription>

                            <CardDescription className="text-xs text-slate-400">
                                Maximum file size: 10MB.
                            </CardDescription>

                            <div className="rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3">
                                <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3 text-sm uppercase tracking-[0.18em]">
                                    {uploadSteps.map((step, index) => (
                                        <Fragment key={step.label}>
                                            <div className="flex items-center gap-3">
                                                <span className={`h-1.5 w-1.5 rounded-full ${step.dot}`} />
                                                <span className={`bg-linear-to-r ${step.gradient} bg-clip-text font-semibold text-transparent`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {index < 2 && (
                                                <span
                                                    className="hidden h-px w-full self-center rounded-full bg-linear-to-r from-purple-500/20 via-fuchsia-400/70 to-red-400/20 shadow-[0_0_12px_rgba(217,70,239,0.35)] sm:block"
                                                />
                                            )}
                                        </Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-base font-semibold text-white">Analysis pathway</p>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">LukaScope AI flow</p>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {analysisPathway.map((step) => (
                                        <div key={step.label} className="rounded-md border border-white/10 bg-white/5 p-3">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${step.bg}`}>
                                                    <step.icon className={`h-4 w-4 ${step.colour}`} />
                                                </div>
                                                <div className="h-px flex-1 bg-linear-to-r from-white/20 to-transparent" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">{step.label}</p>
                                            <p className="text-xs text-slate-400">{step.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-center rounded-lg border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-100">
                                <div className="font-semibold text-white text-base">Sample preview</div>
                                <div className="mt-4 flex items-center gap-5">
                                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30">
                                        <Image
                                            src="/images/sample_1P.png"
                                            alt="Sample smear preview"
                                            fill
                                            sizes="128px"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                    <div className="space-y-2 text-slate-100">
                                        <p className="text-base font-medium">Need a quick test image?</p>
                                        <p className="text-sm text-slate-200">Use this bundled demo smear to try the analysis flow instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            <AnalysisOverlay
                open={analysing}
                jobId={jobId}
                onComplete={(resultId) => router.push(`/results/${resultId}`)}
                onError={(message) => {
                    setAnalysing(false);
                    setError(message);
                }}
            />
        </div>
    );
}
