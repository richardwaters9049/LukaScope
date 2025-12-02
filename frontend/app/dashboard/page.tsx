import React from 'react'
import Nav from '@/components/ui/nav'
import { Card, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'

const page = () => {
    return (
        <div className='w-full'>
            <Nav />
            <section className="flex w-full">
                <div className="left-col p-8 bg-blue-700 w-full"><Card>
                    <CardTitle>Title</CardTitle>
                    <CardHeader>Header</CardHeader>
                    <CardDescription>Description</CardDescription>
                </Card>
                </div>
                <div className="right-col p-8 bg-pink-700 w-full">
                    <Card>
                        <CardTitle>Title</CardTitle>
                        <CardHeader>Header</CardHeader>
                        <CardDescription>Description</CardDescription>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default page