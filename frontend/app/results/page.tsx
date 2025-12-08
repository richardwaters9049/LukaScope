'use client'

import React, { useState } from 'react'
import Nav from '@/components/ui/nav'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Heroicons
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function ResultsPage() {
    const [result, setResult] = useState({
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
        shapHighlight: "/images/sample_positive.png",
        imageUrl: "/images/sample_positive.png",
        history: [
            { date: "2025-11-20", classification: "Negative", confidence: 88 },
            { date: "2025-11-10", classification: "Negative", confidence: 91 }
        ],
        modelVersion: "YOLOv8n + XGBoost v1.2"
    })

    return (
        <div className='w-full'>
            <Nav />

            <section className='flex flex-col w-full h-full p-8 gap-8 text-white'>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className='flex items-center gap-3 mb-4'>
                        {result.classification === "Positive" ? (
                            <XCircleIcon className='h-10 w-10 text-red-600' />
                        ) : (
                            <CheckCircleIcon className='h-10 w-10 text-green-600' />
                        )}
                        <h1 className='text-4xl font-bold'>Sample Analysis Result</h1>
                    </div>

                    {/* Classification + Confidence */}
                    <h2 className='text-2xl font-semibold mt-4'>Classification</h2>
                    <p className='text-xl'>
                        {result.classification} ({result.confidence}% confidence)
                    </p>

                    {/* Sample Metadata */}
                    <h2 className='text-2xl font-semibold mt-6'>Sample Information</h2>
                    <p className='text-lg'>
                        Sample ID: {result.sampleId} | Uploaded by: {result.uploadedBy} | Date: {result.date}
                    </p>
                    <p className='text-lg'>AI Model Version: {result.modelVersion}</p>


                    {/* Cell Statistics */}
                    <h2 className='text-2xl font-semibold mt-6'>Cell Statistics</h2>
                    <p>Total Cells Detected: {result.totalCells}</p>
                    <p>Normal Cells: {result.cellCounts.normal}</p>
                    <p>Abnormal Cells: {result.cellCounts.abnormal}</p>
                    <p>Lymphocytes: {result.cellCounts.lymphocytes}</p>
                    <p>Myeloblasts: {result.cellCounts.myeloblasts}</p>
                    <p>Neutrophils: {result.cellCounts.neutrophils}</p>

                    {/* History */}
                    <h2 className='text-2xl font-semibold mt-6'>History / Previous Results</h2>
                    <ul className='list-disc ml-6'>
                        {result.history.map((h, index) => (
                            <li key={index}>{h.date} — {h.classification} ({h.confidence}%)</li>
                        ))}
                    </ul>

                    {/* Recommendations */}
                    <h2 className='text-2xl font-semibold mt-6'>Recommendations</h2>
                    <p>
                        {result.classification === "Positive"
                            ? "⚠️ This sample requires urgent review by a pathologist."
                            : "This sample is normal. Routine review recommended."}
                    </p>

                    {/* Blood Smear Image */}
                    <h2 className='text-2xl font-semibold mt-6'>Annotated Blood Smear</h2>
                    <div className='mt-2 flex'>
                        <Image
                            src={result.imageUrl}
                            alt='Annotated Blood Smear'
                            width={300}
                            height={300}
                            className='rounded-lg shadow-lg object-contain'
                        />
                    </div>

                    {/* SHAP / Explainability */}
                    <h2 className='text-2xl font-semibold mt-6'>AI Explainability</h2>
                    <div className='mt-2 flex'>
                        <Image
                            src={result.shapHighlight}
                            alt='SHAP Heatmap'
                            width={300}
                            height={300}
                            className='rounded-lg shadow-lg object-contain'
                        />
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
