"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/ui/nav";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, HomeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
    backendAssetUrl,
    displayClassification,
    fetchResult,
    fetchResults,
    submitReview,
    type ResultSummary,
} from "@/lib/api";
import { demoResults, getDemoResult, getResultNeighbors, isDemoResult } from "@/lib/demo-results";
import { formatDisplayDate } from "@/lib/format-date";

type ToastMessage = {
    title: string;
    body: string;
};

export default function ResultsDetailPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    const demoResult = useMemo(() => getDemoResult(id), [id]);
    const [result, setResult] = useState<ResultSummary | null>(() => demoResult ?? null);
    const [loading, setLoading] = useState(() => !demoResult);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [liveResults, setLiveResults] = useState<ResultSummary[]>([]);
    const activeResult = result ?? demoResult;
    const navigationResults = demoResult ? demoResults : liveResults;
    const { previous, next } = getResultNeighbors(navigationResults, activeResult?.id ?? "");

    const showToast = (message: ToastMessage) => {
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
        }

        setToast(message);
        toastTimeout.current = setTimeout(() => setToast(null), 3200);
    };

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

    useEffect(() => {
        return () => {
            if (toastTimeout.current) {
                clearTimeout(toastTimeout.current);
            }
        };
    }, []);

    const approveForTraining = async () => {
        if (!activeResult) return;
        if (isDemoResult(activeResult.id)) {
            setResult({ ...activeResult, review_status: "approved" });
            showToast({
                title: "Approved for retraining",
                body: "Demo sample marked as approved for presentation.",
            });
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
            showToast({
                title: "Approved for retraining",
                body: "Approved for reviewed retraining dataset.",
            });
        } catch (reviewError) {
            showToast({
                title: "Review failed",
                body: reviewError instanceof Error ? reviewError.message : "Unable to submit review.",
            });
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
                        <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" /> Back to Results
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
                                <p><span className="font-medium text-white">Date:</span> {formatDisplayDate(activeResult.created_at)}</p>
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
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-3 lg:col-span-3 md:flex-row md:items-center md:justify-between">
                        <Link
                            href={previous ? `/results/${previous.id}` : "/results"}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="whitespace-nowrap">{previous ? "Previous Result" : "Back to Results"}</span>
                        </Link>
                        <Link
                            href="/results"
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                            All Results
                        </Link>
                        <Link
                            href={next ? `/results/${next.id}` : "/dashboard"}
                            aria-label={next ? "Next result" : "Back to dashboard"}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-sm font-medium text-white hover:bg-slate-700 transition-colors sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
                        >
                            {next ? (
                                <>
                                    <span className="hidden whitespace-nowrap sm:inline">Next Result</span>
                                    <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                                </>
                            ) : (
                                <>
                                    <HomeIcon className="h-5 w-5" aria-hidden="true" />
                                    <span className="hidden whitespace-nowrap sm:inline">Back To Dashboard</span>
                                </>
                            )}
                        </Link>
                    </div>

                </div>

            </motion.section>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-white/10 bg-slate-950/95 p-4 text-white shadow-2xl shadow-slate-950/60 backdrop-blur"
                    >
                        <div className="flex gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-400/10">
                                <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">{toast.title}</p>
                                <p className="text-sm leading-5 text-slate-300">{toast.body}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
