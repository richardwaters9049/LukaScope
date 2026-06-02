"use client";

import React, { useEffect, useState } from "react";
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
    submitReview,
    type ResultSummary,
} from "@/lib/api";

export default function ResultsDetailPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    const [result, setResult] = useState<ResultSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
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
    }, [id]);

    const approveForTraining = async () => {
        if (!result) return;
        setReviewMessage("");
        try {
            await submitReview(result.id, {
                reviewer: "clinician",
                label: result.classification,
                approved_for_training: true,
            });
            const refreshed = await fetchResult(result.id);
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

    if (!result || error) {
        return (
            <div className="min-h-screen">
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
        <div className="min-h-screen">
            <Nav />

            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-6 md:p-10 space-y-8"
            >

                {/* HEADER */}
                <div className="flex items-center gap-4">
                    {result.classification === "positive" || result.classification === "suspicious" ? (
                        <XCircleIcon className="w-10 h-10 text-red-500" />
                    ) : (
                        <CheckCircleIcon className="w-10 h-10 text-green-500" />
                    )}

                    <div className='flex flex-col justify-evenly items-start gap-1'>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Sample Analysis Result
                        </h1>

                        <p className="text-xl mt-1 ml-1">
                            <span className={result.classification === "positive" || result.classification === "suspicious" ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>
                                {displayClassification(result.classification)}
                            </span>
                            <span className="text-white/70">
                                {" "}— {Math.round(result.confidence)}% confidence
                            </span>
                        </p>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

                    {/* INFO PANEL */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card">
                            <h2 className="card-title text-2xl py-2">Sample Information</h2>
                            <div className="card-list">
                                <p><span>ID:</span> {result.sample_id}</p>
                                <p><span>Uploaded by:</span> {result.uploaded_by}</p>
                                <p><span>Date:</span> {new Date(result.created_at).toLocaleString()}</p>
                                <p><span>AI Model:</span> {result.model_version}</p>
                                <p><span>Review:</span> {displayClassification(result.review_status)}</p>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="card-title text-2xl py-2">Clinical Review</h2>
                            <p className="text-sm text-slate-200">
                                Only clinician-approved labels are eligible for retraining.
                            </p>
                            <button
                                type="button"
                                onClick={approveForTraining}
                                disabled={result.review_status === "approved"}
                                className="mt-4 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                            >
                                {result.review_status === "approved" ? "Approved" : "Approve for retraining"}
                            </button>
                            {reviewMessage && <p className="mt-3 text-sm text-slate-200">{reviewMessage}</p>}
                        </div>
                    </div>

                    {/* IMAGE PANELS */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="image-card">
                            <h2 className="card-title text-2xl py-2">Annotated Blood Smear</h2>
                            <div className="image-frame aspect-square w-full overflow-hidden bg-black/20 rounded-xl flex items-center justify-center">
                                <Image
                                    src={backendAssetUrl(result.image_url)}
                                    alt="Annotated Blood Smear"
                                    width={640}
                                    height={640}
                                    className="object-contain h-full w-full"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>

                        <div className="image-card">
                            <h2 className="card-title text-2xl py-2">AI Explainability</h2>

                            <div className="image-frame aspect-square w-full overflow-hidden bg-black/20 rounded-xl flex items-center justify-center">
                                <Image
                                    src={backendAssetUrl(result.heatmap_url)}
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

                    <div className="flex justify-between items-center lg:col-span-3">
                        <Link
                            href="/results"
                            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                        >
                            ← Back to Results
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                            ← Back To Dashboard
                        </Link>
                    </div>

                </div>

            </motion.section>
        </div>
    )
}
