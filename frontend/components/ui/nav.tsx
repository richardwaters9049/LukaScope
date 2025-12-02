import React from 'react'
import Link from 'next/link'


const Navigation = () => {
    return (
        <div className='navbar py-6 px-8 w-full bg-green-600 flex gap-2 justify-between items-center'>
            <div className='logo'>
                <Link href={"/dashboard"}>Logo</Link>
            </div>
            <div>
                <ul className='flex gap-8'>
                    <Link href={"/about"}>About</Link>
                    <Link href={"/results"}>Results</Link>
                    <li>Profile</li>
                    <li>Log Out</li>
                </ul>
            </div>
        </div>
    )
}

export default Navigation