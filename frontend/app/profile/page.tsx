"use client";

import { useRef, useState } from "react";
import Nav from "@/components/ui/nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants, itemVariants } from "@/lib/animations";
import { Bell, CheckCircle2, KeyRound, Save, ShieldCheck, X } from "lucide-react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type ToastMessage = {
    title: string;
    body: string;
};

export default function ProfilePage() {
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (message: ToastMessage) => {
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
        }

        setToast(message);
        toastTimeout.current = setTimeout(() => setToast(null), 3200);
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={pageVariants}
            className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
        >
            <Nav />

            <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
                <motion.header
                    variants={itemVariants}
                    className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold tracking-tight text-white">Profile</h1>
                        <p className="text-slate-300">
                            Manage your account details, preferences, and security settings.
                        </p>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end">
                        <Link
                            href="/dashboard"
                            aria-label="Back to dashboard"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-sm font-medium text-white hover:bg-slate-700 transition-colors sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
                        >
                            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="flex flex-col whitespace-nowrap sm:inline items-center gap-2"> Back to Dashboard</span>
                        </Link>
                    </div>
                </motion.header>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="h-full border-slate-800 bg-slate-900/80 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Account</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Core profile information visible to clinicians and teammates.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Full name</label>
                                    <Input className="border-white/10 bg-slate-950/50 text-white" defaultValue="Dr. Luka Scope" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Email</label>
                                    <Input className="border-white/10 bg-slate-950/50 text-white" type="email" defaultValue="luka.scope@clinic.example" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Role</label>
                                    <Input className="border-white/10 bg-slate-950/50 text-white" defaultValue="Hematology Consultant" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="border border-blue-300/20 bg-linear-to-r from-slate-800 to-blue-900/70 text-white shadow-lg shadow-slate-950/30 hover:from-slate-700 hover:to-blue-800"
                                        onClick={() => showToast({
                                            title: "Profile saved",
                                            body: "Your account details have been updated for this demo session.",
                                        })}
                                    >
                                        <Save className="h-4 w-4" />
                                        Save changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                                        onClick={() => showToast({
                                            title: "Changes cleared",
                                            body: "Unsaved profile edits were reset.",
                                        })}
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="h-full border-slate-800 bg-slate-900/80 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Preferences</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Adjust UI and notification defaults for your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Theme</label>
                                    <Input className="border-white/10 bg-slate-950/50 text-white" defaultValue="System" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Notifications</label>
                                    <div className="space-y-2 text-sm text-slate-200">
                                        <label className="flex items-center gap-2">
                                            <Input type="checkbox" className="h-4 w-4 accent-blue-500" defaultChecked />
                                            Email me when a new analysis is completed
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Input type="checkbox" className="h-4 w-4 accent-blue-500" defaultChecked />
                                            Weekly summary of flagged samples
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Input type="checkbox" className="h-4 w-4 accent-blue-500" />
                                            Product updates and release notes
                                        </label>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="border border-sky-300/20 bg-linear-to-r from-slate-800 to-sky-900/60 text-white shadow-lg shadow-slate-950/30 hover:from-slate-700 hover:to-sky-800"
                                    onClick={() => showToast({
                                        title: "Preferences updated",
                                        body: "Notification settings have been saved.",
                                    })}
                                >
                                    <Bell className="h-4 w-4" />
                                    Update preferences
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </section>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="h-full border-slate-800 bg-slate-900/80 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Security</CardTitle>
                                <CardDescription className="text-slate-300">Keep your account protected.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-slate-200">
                                <p>
                                    Last password change:{" "}
                                    <span className="text-slate-100">12 Jan 2026</span>
                                </p>
                                <p>
                                    Last login (device):{" "}
                                    <span className="text-slate-100">
                                        25 Mar 2026 · Chrome · London, UK
                                    </span>
                                </p>
                                <div className="grid grid-cols-1 gap-3 pt-2 lg:grid-cols-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-auto min-w-0 w-full whitespace-normal px-3 py-2 text-center leading-snug border-amber-300/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20 hover:text-white"
                                        onClick={() => showToast({
                                            title: "Password flow opened",
                                            body: "A secure password update modal would open here.",
                                        })}
                                    >
                                        <KeyRound className="h-4 w-4" />
                                        Change password
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-auto min-w-0 w-full whitespace-normal px-3 py-2 text-center leading-snug border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                                        onClick={() => showToast({
                                            title: "Sessions checked",
                                            body: "Active device sessions are ready for review.",
                                        })}
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        View active sessions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="h-full border-slate-800 bg-slate-900/80 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Activity</CardTitle>
                                <CardDescription className="text-slate-300">Recent actions in LukaScope.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-slate-200">

                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex justify-between border-b border-slate-800 pb-2"
                                >
                                    <span>Uploaded smear sample</span>
                                    <span className="text-slate-400">Today, 10:14</span>
                                </motion.div>

                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex justify-between border-b border-slate-800 pb-2"
                                >
                                    <span>Reviewed flagged result LS-00123</span>
                                    <span className="text-slate-400">Yesterday</span>
                                </motion.div>

                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex justify-between"
                                >
                                    <span>Enabled weekly summaries</span>
                                    <span className="text-slate-400">2 days ago</span>
                                </motion.div>

                            </CardContent>
                        </Card>
                    </motion.div>

                </section>
            </main>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-white/10 bg-slate-950/95 p-4 text-white shadow-2xl shadow-slate-950/60 backdrop-blur"
                    >
                        <div className="flex gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-400/10">
                                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">{toast.title}</p>
                                <p className="text-sm leading-5 text-slate-300">{toast.body}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
