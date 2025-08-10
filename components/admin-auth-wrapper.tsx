"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AdminAuthWrapperProps {
    children: React.ReactNode
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated()) {
                setAuthenticated(true)
            } else {
                router.push("/admin/login")
            }
            setLoading(false)
        }

        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Checking authentication...</p>
                </div>
            </div>
        )
    }

    if (!authenticated) {
        return null
    }

    return <>{children}</>
}
