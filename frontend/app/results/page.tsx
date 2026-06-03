"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Navigation from "@/components/ui/nav";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { backendAssetUrl, displayClassification, fetchResults, type ResultSummary } from "@/lib/api";
import { demoResults } from "@/lib/demo-results";
import { formatDisplayDate } from "@/lib/format-date";

const PAGE_SIZE = 3;

export default function GridLayout() {
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<ResultSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingDemoResults, setUsingDemoResults] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetchResults()
            .then((items) => {
                if (cancelled) return;
                setUsingDemoResults(items.length === 0);
                setResults(items.length > 0 ? items : demoResults);
            })
            .catch(() => {
                if (cancelled) return;
                setUsingDemoResults(true);
                setResults(demoResults);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (loading || results.length === 0) return;

        const scrollTimer = window.setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        }, 2000);

        return () => window.clearTimeout(scrollTimer);
    }, [loading, results.length]);

    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedItems = results.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            <Navigation />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-10 md:px-8"
            >
                <div className="flex w-full flex-col items-center gap-4">
                    <h1 className="text-center text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Sample Analysis Results
                    </h1>
                </div>

                <p className="text-center text-lg text-slate-300 md:text-2xl">
                    Review your sample analysis results below
                </p>
            </motion.div>

            {/* GRID */}
            {loading && (
                <p className="text-center text-slate-200 py-8">Loading analysis results...</p>
            )}

            {usingDemoResults && (
                <p className="mb-8 text-center text-sm text-slate-300">
                    Showing curated demo results. Live uploads will appear here when analyses complete.
                </p>
            )}

            {!loading && results.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-10 text-slate-200">
                    <p>No completed analysis results yet.</p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                    >
                        Upload a sample
                    </Link>
                </div>
            )}

            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
                {paginatedItems.map((item, index) => {
                    const isPositive = item.classification === "positive" || item.classification === "suspicious";

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.08 }}
                        >
                            <Link href={`/results/${item.id}`} className="block">
                                <Card className="overflow-hidden cursor-pointer border-white/10 bg-slate-950/65 text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300">
                                    {/* Image */}
                                    <div className="w-full flex justify-center items-center p-2">
                                        <Image
                                            src={backendAssetUrl(item.image_url)}
                                            alt={`Item ${item.id}`}
                                            className="rounded-lg"
                                            width={200}
                                            height={160}
                                            unoptimized
                                        />
                                    </div>

                                    {/* Content */}
                                    <CardContent className="flex flex-col gap-2 p-4">
                                        <div className="flex flex-col gap-1 text-sm text-white">
                                            <span>{formatDisplayDate(item.created_at)}</span>
                                            <span>Sample ID: {item.sample_id.slice(0, 8)}</span>
                                        </div>

                                        <div className="text-white font-medium">
                                            {item.uploaded_by}
                                        </div>

                                        {/* Classification Preview */}
                                        <div
                                            className={`text-sm font-semibold ${isPositive ? "text-red-500" : "text-green-500"
                                                }`}
                                        >
                                            {displayClassification(item.classification)} — {Math.round(item.confidence)}%
                                        </div>

                                        <div className="text-sm text-slate-300 pt-1">
                                            <p>Read More..</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* PAGINATION */}
            {results.length > PAGE_SIZE && (
                <div className="flex flex-col items-center gap-2 pb-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className="text-white hover:bg-slate-800 hover:text-white"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={page === i + 1}
                                        className="text-white hover:bg-slate-800 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    className="text-white hover:bg-slate-800 hover:text-white"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* Count */}
                    <p className="mt-2 text-sm text-slate-300">
                        Showing {startIndex + 1}–
                        {Math.min(startIndex + PAGE_SIZE, results.length)} of{" "}
                        {results.length} results
                    </p>
                </div>
            )}
        </div>
    );
}
