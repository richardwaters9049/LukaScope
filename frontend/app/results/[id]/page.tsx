"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/ui/nav";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
    backendAssetUrl,
    displayClassification,
    fetchResult,
    fetchResults,
    submitReview,
    type ResultSummary,
} from "@/lib/api";
import { demoResults, getDemoResult, getResultNeighbors, isDemoResult } from "@/lib/demo-results";

export default function ResultsDetailPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    const demoResult = useMemo(() => getDemoResult(id), [id]);
    const [result, setResult] = useState<ResultSummary | null>(() => demoResult ?? null);
    const [loading, setLoading] = useState(() => !demoResult);
    const [error, setError] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");
    const [liveResults, setLiveResults] = useState<ResultSummary[]>([]);
    const activeResult = demoResult ?? result;
    const navigationResults = demoResult ? demoResults : liveResults;
    const { previous, next } = getResultNeighbors(navigationResults, activeResult?.id ?? "");

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        if (demoResult) {
            return;
        }

        fetchResult(id)
            .then((item) => {
                if (!cancelled) setResult(item);
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load result.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [demoResult, id]);

    useEffect(() => {
        if (demoResult) return;
        let cancelled = false;
        fetchResults()
            .then((items) => {
                if (!cancelled) setLiveResults(items);
            })
            .catch(() => {
                if (!cancelled) setLiveResults([]);
            });

        return () => {
            cancelled = true;
        };
    }, [demoResult]);

    const approveForTraining = async () => {
        if (!activeResult) return;
        setReviewMessage("");
        if (isDemoResult(activeResult.id)) {
            setResult({ ...activeResult, review_status: "approved" });
            setReviewMessage("Demo sample marked as approved for presentation.");
            return;
        }

        try {
            await submitReview(activeResult.id, {
                reviewer: "clinician",
                label: activeResult.classification,
                approved_for_training: true,
            });
            const refreshed = await fetchResult(activeResult.id);
            setResult(refreshed);
            setReviewMessage("Approved for reviewed retraining dataset.");
        } catch (reviewError) {
            setReviewMessage(reviewError instanceof Error ? reviewError.message : "Unable to submit review.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Nav />
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-white">
                    <h1 className="text-2xl font-semibold">Loading result...</h1>
                </div>
            </div>
        );
    }

    if (!activeResult || error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
                <Nav />
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-white">
                    <h1 className="text-2xl font-semibold">Result not found</h1>
                    <p className="text-slate-300">{error || `We couldn't find a result for ID: ${id || "unknown"}`}</p>
                    <Link
                        href="/results"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                    >
                        ← Back to Results
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            <Nav />

            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 md:px-8"
            >

                {/* HEADER */}
                <div className="flex items-center gap-4 text-white">
                    {activeResult.classification === "positive" || activeResult.classification === "suspicious" ? (
                        <XCircleIcon className="w-10 h-10 text-red-500" />
                    ) : (
                        <CheckCircleIcon className="w-10 h-10 text-green-500" />
                    )}

                    <div className='flex flex-col justify-evenly items-start gap-1'>
                        <h1 className="text-3xl font-bold text-white md:text-4xl">
                            Sample Analysis Result
                        </h1>

                        <p className="text-xl mt-1 ml-1">
                            <span className={activeResult.classification === "positive" || activeResult.classification === "suspicious" ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>
                                {displayClassification(activeResult.classification)}
                            </span>
                            <span className="text-white/70">
                                {" "}— {Math.round(activeResult.confidence)}% confidence
                            </span>
                        </p>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* INFO PANEL */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-white">
                            <h2 className="py-2 text-2xl font-semibold text-white">Sample Information</h2>
                            <div className="space-y-3 text-sm text-slate-300">
                                <p><span className="font-medium text-white">ID:</span> {activeResult.sample_id}</p>
                                <p><span className="font-medium text-white">Uploaded by:</span> {activeResult.uploaded_by}</p>
                                <p><span className="font-medium text-white">Date:</span> {new Date(activeResult.created_at).toLocaleString()}</p>
                                <p><span className="font-medium text-white">AI Model:</span> {activeResult.model_version}</p>
                                <p><span className="font-medium text-white">Review:</span> {displayClassification(activeResult.review_status)}</p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-white">
                            <h2 className="py-2 text-2xl font-semibold text-white">Clinical Review</h2>
                            <p className="text-sm text-slate-200">
                                Only clinician-approved labels are eligible for retraining.
                            </p>
                            <button
                                type="button"
                                onClick={approveForTraining}
                                disabled={activeResult.review_status === "approved"}
                                className="mt-4 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                            >
                                {activeResult.review_status === "approved" ? "Approved" : "Approve for retraining"}
                            </button>
                            {reviewMessage && <p className="mt-3 text-sm text-slate-200">{reviewMessage}</p>}
                        </div>
                    </div>

                    {/* IMAGE PANELS */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-white">
                            <h2 className="py-2 text-2xl font-semibold text-white">Annotated Blood Smear</h2>
                            <div className="image-frame aspect-square w-full overflow-hidden bg-black/20 rounded-xl flex items-center justify-center">
                                <Image
                                    src={backendAssetUrl(activeResult.image_url)}
                                    alt="Annotated Blood Smear"
                                    width={640}
                                    height={640}
                                    className="object-contain h-full w-full"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-white">
                            <h2 className="py-2 text-2xl font-semibold text-white">AI Explainability</h2>

                            <div className="image-frame aspect-square w-full overflow-hidden bg-black/20 rounded-xl flex items-center justify-center">
                                <Image
                                    src={backendAssetUrl(activeResult.heatmap_url)}
                                    alt="AI Explainability"
                                    width={640}
                                    height={640}
                                    className="object-contain h-full w-full"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-3 lg:col-span-3 md:flex-row md:items-center md:justify-between">
                        <Link
                            href={previous ? `/results/${previous.id}` : "/results"}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                        >
                            ← {previous ? "Previous Result" : "Back to Results"}
                        </Link>
                        <Link
                            href="/results"
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                            All Results
                        </Link>
                        <Link
                            href={next ? `/results/${next.id}` : "/dashboard"}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                        >
                            {next ? "Next Result" : "Back To Dashboard"} →
                        </Link>
                    </div>

                </div>

            </motion.section>
        </div>
    )
}
