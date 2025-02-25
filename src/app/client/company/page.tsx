'use client'

import CompanyList from '@/app/Components/Client/company/page'
import Header from '@/app/Components/Client/Header/page'
import React from 'react'

const Jobs = () => {
    return (
        <>
        <div className="min-h-screen ">
            <main>
            <CompanyList/>
            </main>
        </div>
        </>
    )
}

export default Jobs
