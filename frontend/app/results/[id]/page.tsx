"use client";

import React from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/ui/nav";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { resultsById } from "@/lib/results-data";

export default function ResultsDetailPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    const result = id ? resultsById[id] : undefined;

    if (!result) {
        return (
            <div className="min-h-screen">
                <Nav />
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-white">
                    <h1 className="text-2xl font-semibold">Result not found</h1>
                    <p className="text-slate-300">We couldn&apos;t find a result for ID: {id || "unknown"}</p>
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
                    {result.classification === "Positive" ? (
                        <XCircleIcon className="w-10 h-10 text-red-500" />
                    ) : (
                        <CheckCircleIcon className="w-10 h-10 text-green-500" />
                    )}

                    <div className='flex flex-col justify-evenly items-start gap-1'>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Sample Analysis Result
                        </h1>

                        <p className="text-xl mt-1 ml-1">
                            <span className={result.classification === "Positive" ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>
                                {result.classification}
                            </span>
                            <span className="text-white/70">
                                {" "}— {result.confidence}% confidence
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
                                <p><span>ID:</span> {result.sampleId}</p>
                                <p><span>Uploaded by:</span> {result.uploadedBy}</p>
                                <p><span>Date:</span> {result.date}</p>
                                <p><span>AI Model:</span> {result.modelVersion}</p>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="card-title text-2xl py-2">Cell Statistics</h2>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <p><span>Total:</span> {result.totalCells}</p>
                                <p><span>Normal:</span> {result.cellCounts.normal}</p>
                                <p><span>Abnormal:</span> {result.cellCounts.abnormal}</p>
                                <p><span>Lymphocytes:</span> {result.cellCounts.lymphocytes}</p>
                                <p><span>Myeloblasts:</span> {result.cellCounts.myeloblasts}</p>
                                <p><span>Neutrophils:</span> {result.cellCounts.neutrophils}</p>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="card-title text-2xl py-2">Previous Results</h2>
                            <ul className="space-y-1 text-sm">
                                {result.history.map((h, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between border-b border-white/5 pb-1"
                                    >
                                        <span>{h.date}</span>
                                        <span className="opacity-80">
                                            {h.classification} ({h.confidence}%)
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* IMAGE PANELS */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="image-card">
                            <h2 className="card-title text-2xl py-2">Annotated Blood Smear</h2>
                            <div className="image-frame aspect-square w-full overflow-hidden bg-black/20 rounded-xl flex items-center justify-center">
                                <Image
                                    src={result.imageUrl}
                                    alt="Annotated Blood Smear"
                                    width={640}
                                    height={640}
                                    className="object-contain h-full w-full"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="image-card">
                            <h2 className="card-title text-2xl py-2">AI Explainability</h2>

                            <div className="image-frame aspect-square w-full overflow-hidden bg-black/20 rounded-xl flex items-center justify-center">
                                <Image
                                    src={result.explainability[result.primaryExplainability]}
                                    alt="AI Explainability"
                                    width={640}
                                    height={640}
                                    className="object-contain h-full w-full"
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
