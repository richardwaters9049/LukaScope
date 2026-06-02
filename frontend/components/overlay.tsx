'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { fetchAnalysisJob, type JobStatus } from '@/lib/api'

type Props = {
    open: boolean
    jobId: string | null
    onComplete: (resultId: string) => void
    onError: (message: string) => void
}

export default function AnalysisOverlay({ open, jobId, onComplete, onError }: Props) {
    const [stage, setStage] = useState<'scan' | 'detect' | 'explain'>('scan')
    const [status, setStatus] = useState<JobStatus>('queued')
    const [confidence, setConfidence] = useState(72)
    const [displayConfidence, setDisplayConfidence] = useState(72)
    const confidenceRef = useRef(72)

    const copy = {
        scan: {
            title: 'Scanning sample…',
            body: 'Segmenting cells, normalizing staining, and extracting morphological features from the slide.',
        },
        detect: {
            title: 'Detecting abnormal cells…',
            body: 'Running the classifier on each region and flagging suspicious cell morphology (highlighted on the image).',
        },
        explain: {
            title: 'Generating explainability…',
            body: 'Computing an attribution heatmap to show which visual features contributed most to the prediction.',
        },
    } as const

    useEffect(() => {
        const controls = animate(confidenceRef.current, confidence, {
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: latest => setDisplayConfidence(Math.round(latest)),
        })

        confidenceRef.current = confidence
        return () => controls.stop()
    }, [confidence])

    useEffect(() => {
        if (!open || !jobId) return

        let cancelled = false
        let timer: ReturnType<typeof setTimeout> | undefined

        const run = async () => {
            setStage('scan')
            setStatus('queued')
            setConfidence(72)

            const poll = async () => {
                try {
                    const job = await fetchAnalysisJob(jobId)
                    if (cancelled) return
                    setStatus(job.status)

                    if (job.status === 'queued') {
                        setStage('scan')
                        setConfidence(72)
                    } else if (job.status === 'running') {
                        setStage('detect')
                        setConfidence(86)
                    } else if (job.status === 'completed' && job.result_id) {
                        setStage('explain')
                        setConfidence(96)
                        timer = setTimeout(() => onComplete(job.result_id as string), 650)
                        return
                    } else if (job.status === 'failed') {
                        onError(job.error_message ?? 'Analysis failed. Please try another sample.')
                        return
                    }

                    timer = setTimeout(poll, 1200)
                } catch (error) {
                    if (!cancelled) onError(error instanceof Error ? error.message : 'Unable to read analysis status.')
                }
            }

            await poll()
        }

        run()

        return () => {
            cancelled = true
            if (timer) clearTimeout(timer)
        }
    }, [open, jobId, onComplete, onError])

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md text-white px-4 py-10"
                >
                    <div className="w-full max-w-5xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 items-center">

                            {/* IMAGE */}
                            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                <Image
                                    src="/images/sample_2N.png"
                                    alt="Sample"
                                    fill
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    className="object-contain"
                                    priority
                                />

                                {stage === 'detect' && (
                                    <FlashBox x="22%" y="35%" />
                                )}

                                {stage === 'explain' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.8 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src="/images/shap_heatmap.png"
                                            alt="Heatmap"
                                            fill
                                            sizes="(min-width: 768px) 50vw, 100vw"
                                            className="object-contain"
                                            priority
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {/* STATUS */}
                            <div className="flex flex-col justify-center gap-6 tracking-wider">
                                <h1 className="text-3xl font-bold">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={stage}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                            className="inline-block"
                                        >
                                            {copy[stage].title}
                                        </motion.span>
                                    </AnimatePresence>
                                </h1>

                                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
                                    {status}
                                </p>

                                <p className="text-xl">
                                    Confidence:&nbsp;
                                    <span className="text-green-400 font-semibold">
                                        {displayConfidence}%
                                    </span>
                                </p>

                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={`${stage}-body`}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                        className="text-sm opacity-85 leading-relaxed max-w-md"
                                    >
                                        {copy[stage].body}
                                    </motion.p>
                                </AnimatePresence>

                                <div className="text-sm opacity-80 space-y-1">
                                    <p>• Cell segmentation</p>
                                    <p>• Feature extraction</p>
                                    <p>• Model inference</p>
                                    <p>• Explainability mapping</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const FlashBox = ({ x, y }: { x: string; y: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.6 }}
        className="absolute border-2 border-red-500 rounded-md"
        style={{ left: x, top: y, width: 80, height: 80 }}
    />
)
