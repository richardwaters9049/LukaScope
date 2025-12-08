"use client"
import React from 'react'
import Link from 'next/link'
import Image from "next/image"
import { useRouter } from 'next/navigation'
import LogoImg from "@/public/images/LumaScope Logo 4.png"

const Navigation = () => {
    const router = useRouter()

    const handleLogout = () => {
        document.cookie = "session=; Max-Age=0; path=/"
        router.push("/")
    }

    return (
        <div className='navbar py-6 px-8 w-full flex gap-4 justify-between items-center text-xl'>
            <div className='logo flex gap-4 items-center'>
                <Link href={"/dashboard"}>
                    <Image src={LogoImg} alt="Logo" width={80} height={80} />
                </Link>
                <p>Welcome User Name</p>
            </div>
            <div>
                <ul className='flex gap-8'>
                    <Link href={"/about"}>About</Link>
                    <Link href={"/results"}>Results</Link>
                    <Link href={"/profile"}>Profile</Link>
                    <li
                        onClick={handleLogout}
                        className="cursor-pointer hover:underline underline-offset-5"
                    >
                        Log Out
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navigation
