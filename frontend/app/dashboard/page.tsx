"use client";

import Nav from "@/components/ui/nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardTitle,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const page = () => {
    return (
        <div className="w-full">
            <Nav />

            <section className="w-full min-h-screen tracking-wider p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ======================
                        SUMMARY PANEL
                    ====================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Card className="h-full">
                            <CardTitle className="flex items-center gap-2">
                                Hello.. 👋
                            </CardTitle>

                            <CardHeader className="flex items-center gap-2">
                                Welcome to LukaScope
                            </CardHeader>

                            <CardDescription>
                                LukaScope is an AI-powered blood sample analysis platform
                                designed to assist clinicians and laboratory professionals in
                                identifying potential indicators of leukaemia.
                            </CardDescription>

                            <CardDescription>
                                Users securely upload blood smear samples, which are processed
                                by our computer vision and machine learning models to classify
                                samples, estimate confidence, and extract detailed cell
                                statistics.
                            </CardDescription>

                            <CardDescription>
                                The system is built using Next.js, TypeScript, TailwindCSS,
                                PostgreSQL, and modern AI pipelines (YOLO-based detection with
                                gradient-boosted classifiers), ensuring speed, accuracy, and
                                explainability.
                            </CardDescription>

                            <CardDescription>
                                Each uploaded sample is linked to the authenticated user,
                                allowing results, history, and AI explainability outputs to be
                                reviewed clearly and consistently.
                            </CardDescription>
                        </Card>
                    </motion.div>

                    {/* ======================
                        UPLOAD PANEL
                    ====================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    >
                        <Card className="h-auto flex flex-col gap-4">
                            <CardTitle className="flex items-center gap-2">
                                <ArrowUpTrayIcon className="h-5 w-5" />
                                Upload Sample
                            </CardTitle>

                            <Input type="file" className="cursor-pointer" />

                            <div className="submit-btn flex justify-center my-5">
                                <Button className="flex items-center gap-2 transition-transform hover:scale-102 active:scale-95 w-1/2">
                                    <ArrowUpTrayIcon className="h-4 w-4" />
                                    Submit
                                </Button>
                            </div>

                            <CardDescription className="text-sm opacity-80">
                                Upload a blood smear image to begin AI analysis.
                            </CardDescription>
                            <CardDescription className="text-xs opacity-50">
                                Supported formats: JPG, PNG, TIFF.
                            </CardDescription>

                            <CardDescription className="text-xs opacity-40">
                                Maximum file size: 10MB.
                            </CardDescription>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default page;
