"use client";

import Link from 'next/link';
import React from 'react'

const Logo = () => {
    return (
        <> <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-500">🌐</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
                SocialFusion
            </span>
        </Link></>
    )
}

export default Logo