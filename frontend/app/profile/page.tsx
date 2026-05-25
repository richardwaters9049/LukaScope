"use client";

import Nav from "@/components/ui/nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";

const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: cubicBezier(0.25, 0.1, 0.25, 1),
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: cubicBezier(0.25, 0.1, 0.25, 1)
        }
    }
};

export default function ProfilePage() {
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
                        <h1 className="text-4xl font-semibold tracking-tight">Profile</h1>
                        <p className="text-slate-300">
                            Manage your account details, preferences, and security settings.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </motion.header>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="bg-slate-900/80 border-slate-800 h-full">
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Core profile information visible to clinicians and teammates.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Full name</label>
                                    <Input defaultValue="Dr. Luka Scope" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Email</label>
                                    <Input type="email" defaultValue="luka.scope@clinic.example" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Role</label>
                                    <Input defaultValue="Hematology Consultant" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button size="sm">Save changes</Button>
                                    <Button variant="ghost" size="sm">
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="bg-slate-900/80 border-slate-800 h-full">
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>
                                    Adjust UI and notification defaults for your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Theme</label>
                                    <select className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm border border-slate-700 focus:border-slate-500 focus:outline-none">
                                        <option>System</option>
                                        <option>Light</option>
                                        <option>Dark</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Notifications</label>
                                    <div className="space-y-2 text-sm text-slate-200">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="accent-blue-500" defaultChecked />
                                            Email me when a new analysis is completed
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="accent-blue-500" defaultChecked />
                                            Weekly summary of flagged samples
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="accent-blue-500" />
                                            Product updates and release notes
                                        </label>
                                    </div>
                                </div>
                                <Button size="sm">Update preferences</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </section>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="bg-slate-900/80 border-slate-800 h-full">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>Keep your account protected.</CardDescription>
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
                                <div className="flex gap-3 pt-2">
                                    <Button size="sm" variant="outline">
                                        Change password
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        View active sessions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div layout variants={itemVariants} className="h-full">
                        <Card className="bg-slate-900/80 border-slate-800 h-full">
                            <CardHeader>
                                <CardTitle>Activity</CardTitle>
                                <CardDescription>Recent actions in LukaScope.</CardDescription>
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
        </motion.div>
    );
}