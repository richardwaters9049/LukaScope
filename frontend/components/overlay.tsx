'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type Props = {
    open: boolean
    onComplete: () => void
}

export default function AnalysisOverlay({ open, onComplete }: Props) {
    const [stage, setStage] = useState<'scan' | 'detect' | 'explain'>('scan')
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
        if (!open) return

        let cancelled = false

        const run = async () => {
            setStage('scan')
            setConfidence(72)

            await wait(2200)
            if (cancelled) return
            setConfidence(89)
            setStage('detect')

            await wait(2200)
            if (cancelled) return
            setConfidence(92)
            setStage('explain')

            await wait(2600)
            if (cancelled) return
            onComplete()
        }

        run()

        return () => {
            cancelled = true
        }
    }, [open, onComplete])

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
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/40">
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

const wait = (ms: number) => new Promise(res => setTimeout(res, ms))
