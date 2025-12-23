'use client'

import React, { useState } from 'react'
import Nav from '@/components/ui/nav'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function ResultsPage() {
    const [result] = useState({
        sampleId: "LS-00123",
        uploadedBy: "Admin User",
        date: "2025-12-03 14:32",
        classification: "Positive",
        confidence: 92,
        totalCells: 155,
        cellCounts: {
            normal: 120,
            abnormal: 35,
            lymphocytes: 50,
            myeloblasts: 30,
            neutrophils: 75
        },

        imageUrl: "/images/sample_1P.png",

        // ✅ NEW: explainability object
        primaryExplainability: "shap",
        explainability: {
            gradient: "/images/gradient_heatmap.png",
            guided_backprop: "/images/guided_backprop.png",
            shap: "/images/shap_heatmap.png"
        },

        history: [
            { date: "2025-11-20", classification: "Negative", confidence: 88 },
            { date: "2025-11-10", classification: "Negative", confidence: 91 }
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2"
    })

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
                            <div className="image-frame">
                                <Image
                                    src={result.imageUrl}
                                    alt="Annotated Blood Smear"
                                    width={300}
                                    height={300}
                                    className="object-center rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="image-card">
                            <h2 className="card-title text-2xl py-2">AI Explainability</h2>

                            <div className="image-frame">
                                <Image
                                    src={result.explainability[result.primaryExplainability as keyof typeof result.explainability]}
                                    alt="AI Explainability"
                                    width={300}
                                    height={300}
                                    className="object-contain rounded-lg"
                                />
                            </div>
                            {/* <p className="text-sm text-gray-300 mt-2">
                                SHAP values highlight which cellular features the AI model found most indicative of the detected classification. Darker regions indicate higher influence on the prediction, helping explain the AI&apos;s decision-making process.
                            </p> */}
                        </div>

                    </div>
                </div>

            </motion.section>
        </div>
    )
}
