'use client'

import Header from '@/app/Components/Client/Header/page'
import JobList from '@/app/Components/Client/job/page'
import React from 'react'

const Jobs = () => {
    return (
        <>
        <div className="min-h-screen">
            <main >
                <JobList />
            </main>
        </div>
        </>
    )
}

export default Jobs
