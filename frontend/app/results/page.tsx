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
import { useState } from "react";
import { resultsData } from "@/lib/results-data";

const PAGE_SIZE = 6;

export default function GridLayout() {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(resultsData.length / PAGE_SIZE);
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedItems = resultsData.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="main-grid">
            <Navigation />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="title-container flex flex-col items-center gap-8 p-6 m-8"
            >
                <div className="title-container flex justify-around gap-10 w-full">
                    {/* TITLE */}
                    <h1 className="text-5xl font-medium text-center tracking-wider justify-center">
                        Sample Analysis Results
                    </h1>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <p className="text-center text-2xl text-white">
                    Review your sample analysis results below
                </p>
            </motion.div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[15px] gap-y-[20px] p-4">
                {paginatedItems.map((item, index) => {
                    const isPositive = item.classification === "Positive";

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.08 }}
                        >
                            <Link href={`/results/${item.id}`} className="block">
                                <Card className="overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300">
                                    {/* Image */}
                                    <div className="w-full flex justify-center items-center p-2">
                                        <Image
                                            src={item.imageUrl}
                                            alt={`Item ${item.id}`}
                                            className="rounded-lg"
                                            priority
                                            width={200}
                                            height={160}
                                        />
                                    </div>

                                    {/* Content */}
                                    <CardContent className="flex flex-col gap-2 p-4">
                                        <div className="flex justify-between text-sm text-white">
                                            <span>{item.date.split(" ")[0]}</span>
                                            <span>Sample ID: {item.id}</span>
                                        </div>

                                        <div className="text-white font-medium">
                                            {item.uploadedBy}
                                        </div>

                                        {/* Classification Preview */}
                                        <div
                                            className={`text-sm font-semibold ${isPositive ? "text-red-500" : "text-green-500"
                                                }`}
                                        >
                                            {item.classification} — {item.confidence}%
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
            {resultsData.length > PAGE_SIZE && (
                <div className="flex flex-col items-center gap-2 pb-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={page === i + 1}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* Count */}
                    <p className="text-sm text-muted-foreground mt-2">
                        Showing {startIndex + 1}–
                        {Math.min(startIndex + PAGE_SIZE, resultsData.length)} of{" "}
                        {resultsData.length} results
                    </p>
                </div>
            )}
        </div>
    );
}