'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AnalysisOverlay from '@/components/overlay'

export default function AnalysisTestPage() {
    const [analysing, setAnalysing] = useState(false)
    const router = useRouter()

    const handleUpload = () => {
        setAnalysing(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center tracking-wider">
            {!analysing && (
                <Button
                    onClick={handleUpload}
                    className="px-10 py-6 text-lg"
                >
                    Upload Sample
                </Button>
            )}

            <AnalysisOverlay open={analysing} onComplete={() => router.push('/results_id')} />
        </div>
    )
}
