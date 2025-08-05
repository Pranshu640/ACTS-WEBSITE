"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"
import { validateCredentials, setAuthToken } from "@/lib/auth"

export default function AdminLogin() {
    const router = useRouter()
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (validateCredentials(credentials.username, credentials.password)) {
            setAuthToken()
            router.push("/admin")
        } else {
            setError("Invalid username or password")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl">
                    <CardHeader className="text-center pb-8">
                        <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-light text-white tracking-wide">ACTS Admin Access</CardTitle>
                        <p className="text-gray-400 text-sm mt-2">Enter your credentials to access the admin panel</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-300 font-light">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                                        className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 pl-10"
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300 font-light">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                                        className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 pl-10"
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-300 py-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Authenticating...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
