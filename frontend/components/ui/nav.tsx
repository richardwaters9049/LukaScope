"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import LogoImg from "@/public/images/LumaScope Logo 4.png"

const Navigation = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        document.cookie = "session=; Max-Age=0; path=/"
        router.push("/")
    }

    const menuItems = (
        <>
            <Link href="/results" onClick={() => setOpen(false)}>
                Results
            </Link>
            <Link href="/profile" onClick={() => setOpen(false)}>
                Profile
            </Link>
            <button
                onClick={handleLogout}
                className="text-left hover:text-red-400 transition"
            >
                Log Out
            </button>
        </>
    )

    return (
        <nav className="w-full border-b border-white/10 bg-linear-to-b from-blue-900/20 to-black/5 text-white tracking-wider">
            <div className="flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Image
                            src={LogoImg}
                            alt="LukaScope Logo"
                            width={48}
                            height={48}
                            priority
                        />
                    </Link>
                    <span className="hidden sm:block text-lg font-medium">
                        Welcome
                    </span>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-8 text-lg">
                    {menuItems}
                </ul>

                {/* Mobile Burger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden"
                    aria-label="Toggle Menu"
                >
                    {open ? (
                        <XMarkIcon className="w-8 h-8" />
                    ) : (
                        <Bars3Icon className="w-8 h-8" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden border-t border-white/10"
                    >
                        <div className="flex flex-col gap-4 px-6 py-6 text-lg bg-neutral-950">
                            {menuItems}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navigation
