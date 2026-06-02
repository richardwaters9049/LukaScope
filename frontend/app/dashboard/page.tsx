"use client";

import { useState } from "react";
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
import AnalysisOverlay from "@/components/overlay";
import Image from "next/image";
import { uploadSample } from "@/lib/api";

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
        <div className="w-full">
            <Nav />

            <section className="w-full min-h-screen tracking-wider p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ======================
                        SUMMARY PANEL
                    ====================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Card className="h-full">
                            <CardTitle className="flex items-center gap-2 text-5xl">
                                Welcome to LukaScope
                            </CardTitle>

                            <CardDescription>
                                LukaScope is an AI-powered blood sample analysis platform
                                designed to assist clinicians and laboratory professionals in
                                identifying potential indicators of leukaemia.
                            </CardDescription>

                            <CardDescription>
                                Users securely upload blood smear samples, which are processed
                                by our computer vision and machine learning models to classify
                                samples, estimate confidence, and extract detailed cell
                                statistics.
                            </CardDescription>

                            <CardDescription>
                                The system is built using Next.js, TypeScript, TailwindCSS,
                                PostgreSQL, and modern AI pipelines (YOLO-based detection with
                                gradient-boosted classifiers), ensuring speed, accuracy, and
                                explainability.
                            </CardDescription>

                            <CardDescription>
                                Each uploaded sample is linked to the authenticated user,
                                allowing results, history, and AI explainability outputs to be
                                reviewed clearly and consistently.
                            </CardDescription>
                        </Card>
                    </motion.div>

                    {/* ======================
                        UPLOAD PANEL
                    ====================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    >
                        <Card className="h-auto flex flex-col gap-4">
                            <CardTitle className="flex items-center gap-2">
                                Upload Sample
                            </CardTitle>

                            <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.tif,.tiff"
                                className="cursor-pointer"
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

                            <CardDescription className="text-sm opacity-80">
                                Upload a blood smear image to begin AI analysis.
                            </CardDescription>
                            <CardDescription className="text-xs opacity-50">
                                Supported formats: JPG, PNG, TIFF.
                            </CardDescription>

                            <CardDescription className="text-xs opacity-40">
                                Maximum file size: 10MB.
                            </CardDescription>

                            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200 space-y-2">
                                <div className="font-semibold text-white">Upload tips</div>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Use the clearest smear image available (avoid blur and glare).</li>
                                    <li>Single file per upload is supported today.</li>
                                    <li>Demo images live in <code>/public/images</code> if you need a sample.</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-100 space-y-3">
                                <div className="font-semibold text-white text-base">Sample preview</div>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-24 w-24 overflow-hidden rounded-md border border-white/10 bg-black/30">
                                        <Image
                                            src="/images/sample_1P.png"
                                            alt="Sample smear preview"
                                            fill
                                            sizes="96px"
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
