"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

export default function AskQuestionsSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        question: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")


    const SHEETDB_API_URL = "https://sheetdb.io/api/v1/dznweqpq0r8jy"

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error when user starts typing
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        // Validate all fields are filled
        if (!formData.name.trim() || !formData.email.trim() || !formData.question.trim()) {
            setError("Please fill in all required fields.")
            setIsSubmitting(false)
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.")
            setIsSubmitting(false)
            return
        }

        try {
            console.log("Submitting to SheetDB:", SHEETDB_API_URL)
            console.log("Form data:", formData)

            // Try the standard SheetDB format first
            const payload = {
                data: [
                    {
                        name: formData.name,
                        email: formData.email,
                        question: formData.question,
                        timestamp: "DATETIME",
                        status: "New"
                    }
                ]
            }

            console.log("Payload being sent:", JSON.stringify(payload, null, 2))

            const response = await fetch(SHEETDB_API_URL, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            console.log("Response status:", response.status)
            let responseData
            try {
                responseData = await response.json()
            } catch {
                responseData = await response.text()
            }
            console.log("Response data:", responseData)

            if (response.ok) {
                console.log("✅ Success! Created rows:", responseData.created || responseData)
                setIsSubmitted(true)
                setFormData({ name: "", email: "", question: "" })
                setTimeout(() => setIsSubmitted(false), 5000)
            } else {
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(responseData)}`)
            }
        } catch (error) {
            console.error("Error submitting question:", error)
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setError("Network error. Please check your internet connection and try again.")
            } else if (error.message.includes('CORS')) {
                setError("CORS error. Please check your SheetDB API configuration.")
            } else if (error.message.includes('404')) {
                setError("API endpoint not found. Please verify your SheetDB URL.")
            } else {
                setError(`Failed to submit: ${error.message}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-black via-black to-[#01736d]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-light text-white mb-4 tracking-wide">Ask a Question</h2>
                    <div className="w-16 h-0.5 bg-white mx-auto mb-8"></div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Have a question that wasn't covered in our FAQ? We'd love to hear from you and provide personalized
                        assistance.
                    </p>
                </div>

                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden">
                    <CardContent className="p-0">
                        {isSubmitted ? (
                            <div className="text-center py-16 px-8">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-light text-white mb-3 tracking-wide">Thank you!</h3>
                                <p className="text-gray-300 font-light leading-relaxed">
                                    Your question has been submitted successfully. We'll get back to you soon.
                                </p>
                            </div>
                        ) : (
                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {error && (
                                        <div className="flex items-center space-x-2 p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                            <p className="text-red-400 font-light text-sm">{error}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-sm font-light text-gray-300 tracking-wide">
                                                Full Name <span className="text-red-400">*</span>
                                            </label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 h-12 rounded-xl font-light"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-light text-gray-300 tracking-wide">
                                                Email Address <span className="text-red-400">*</span>
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 h-12 rounded-xl font-light"
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="question" className="block text-sm font-light text-gray-300 tracking-wide">
                                            Your Question <span className="text-red-400">*</span>
                                        </label>
                                        <Textarea
                                            id="question"
                                            name="question"
                                            required
                                            rows={6}
                                            value={formData.question}
                                            onChange={handleInputChange}
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 resize-none rounded-xl font-light"
                                            placeholder="Please describe your question in detail..."
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-[#01736d] to-[#019688] hover:from-[#015a52] hover:to-[#017670] text-white border-0 h-12 rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    <span>Submitting...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <Send className="w-4 h-4" />
                                                    <span>Send Question</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}