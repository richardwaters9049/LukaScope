"use client";

import Image from "next/image";
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

const PAGE_SIZE = 6;

const items = [
    {
        id: 1,
        image: "/images/sample_1P.png",
        date: "2025-12-16",
        author: "John Doe",
        classification: "Positive",
        confidence: 92,
    },
    {
        id: 2,
        image: "/images/sample_2N.png",
        date: "2025-12-15",
        author: "Jane Smith",
        classification: "Negative",
        confidence: 89,
    },
    {
        id: 3,
        image: "/images/sample_3P.png",
        date: "2025-12-14",
        author: "Alice Johnson",
        classification: "Positive",
        confidence: 95,
    },
    {
        id: 4,
        image: "/images/sample_4N.png",
        date: "2025-10-24",
        author: "Bob Strike",
        classification: "Negative",
        confidence: 91,
    },
    {
        id: 5,
        image: "/images/sample_5P.png",
        date: "2025-12-03",
        author: "Greg Apple",
        classification: "Positive",
        confidence: 87,
    },
    {
        id: 6,
        image: "/images/sample_6N.png",
        date: "2025-12-14",
        author: "Suzie Q",
        classification: "Negative",
        confidence: 90,
    },
    {
        id: 7,
        image: "/images/sample_1P.png",
        date: "2025-12-01",
        author: "Extra User",
        classification: "Positive",
        confidence: 93,
    },
];

export default function GridLayout() {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedItems = items.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="main-grid">
            <Navigation />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="title-container flex flex-col items-center gap-8 p-6 m-8"
            >
                {/* TITLE */}
                <h1 className="text-5xl font-medium text-center tracking-wider">
                    Sample Analysis Results
                </h1>

                <p className="text-center text-2xl text-white">Review your sample analysis results below</p>

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
                            <Card className="overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300">
                                {/* Image */}
                                <div className="w-full flex justify-center items-center p-2">
                                    <Image
                                        src={item.image}
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
                                        <span>{item.date}</span>
                                        <span>Sample ID: {item.id}</span>
                                    </div>

                                    <div className="text-white font-medium">
                                        {item.author}
                                    </div>

                                    {/* Classification Preview */}
                                    <div
                                        className={`text-sm font-semibold ${isPositive ? "text-red-500" : "text-green-500"
                                            }`}
                                    >
                                        {item.classification} — {item.confidence}%
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* PAGINATION */}
            {items.length > PAGE_SIZE && (
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
                                    onClick={() =>
                                        setPage((p) => Math.min(totalPages, p + 1))
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* Count */}
                    <p className="text-sm text-muted-foreground mt-2">
                        Showing {startIndex + 1}–
                        {Math.min(startIndex + PAGE_SIZE, items.length)} of{" "}
                        {items.length} results
                    </p>
                </div>
            )}
        </div>
    );
}
