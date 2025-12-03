"use client"
import React from 'react'
import Nav from '@/components/ui/nav'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'

// Heroicons
import {
    ArrowUpTrayIcon,
    BeakerIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'

const page = () => {
    return (
        <div className='w-full'>
            <Nav />
            <section className="flex w-full h-screen">
                <div className="left-col p-8 w-full flex flex-col gap-2">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Card>
                            <CardTitle className="flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5" />
                                Hello.. 👋
                            </CardTitle>

                            <CardHeader className="flex items-center gap-2">
                                <BeakerIcon className="h-5 w-5" />
                                Welcome To LukaScope
                            </CardHeader>

                            <CardDescription>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Repellendus beatae quas, rem sit neque hic iure ad consectetur?
                                Eaque quasi esse velit nihil exercitationem, culpa doloribus
                                soluta dolores explicabo quis.
                            </CardDescription>
                            <CardDescription>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Repellendus beatae quas, rem sit neque hic iure ad consectetur?
                                Eaque quasi esse velit nihil exercitationem, culpa doloribus
                                soluta dolores explicabo quis.
                            </CardDescription>
                            <CardDescription>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Repellendus beatae quas, rem sit neque hic iure ad consectetur?
                                Eaque quasi esse velit nihil exercitationem, culpa doloribus
                                soluta dolores explicabo quis.
                            </CardDescription>
                        </Card>
                    </motion.div>
                </div>

                <div className="right-col p-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    >
                        <Card>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowUpTrayIcon className="h-8 w-8" />
                                Upload File
                            </CardTitle>

                            <Input type="file" className='cursor-pointer' />

                            <Button className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                                <ArrowUpTrayIcon className="h-4 w-4" />
                                Submit
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default page
