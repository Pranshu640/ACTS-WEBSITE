"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "What is the purpose of our club?",
        answer:
            "Our club is dedicated to fostering professional development, networking opportunities, and community engagement among our members. We provide a platform for knowledge sharing, skill development, and meaningful connections within our industry.",
    },
    {
        question: "How can I become a member?",
        answer:
            "Membership is open to professionals in our field who share our values and commitment to excellence. You can apply through our website by filling out the membership application form. All applications are reviewed by our membership committee.",
    },
    {
        question: "What are the membership benefits?",
        answer:
            "Members enjoy exclusive access to networking events, professional development workshops, industry insights, mentorship programs, and our extensive professional network. We also offer discounted rates for conferences and special events.",
    },
    {
        question: "How often do you hold events?",
        answer:
            "We organize monthly networking events, quarterly professional development workshops, and an annual conference. Additionally, we host special events throughout the year based on member interests and industry developments.",
    },
    {
        question: "Can I volunteer or get involved in leadership?",
        answer:
            "We encourage member participation and offer various volunteer opportunities. Leadership positions are available through our annual elections, and we welcome members who want to contribute to committees and special projects.",
    },
]

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="py-24 px-4 bg-black">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-light text-white mb-4 tracking-wide">Frequently Asked</h2>
                    <h2 className="text-5xl font-light text-white mb-4 tracking-wide text-#01736d"> Questions</h2>
                    <div className="w-16 h-0.5 bg-white mx-auto mb-8"></div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light ">
                        Find answers to common questions about our club, membership, and activities.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-900/50 backdrop-blur-sm  rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-900/70"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-6 text-left flex justify-between items-center ">
                                <h3 className="text-xl font-medium text-white pr-8 tracking-wide">{faq.question}</h3>
                                <ChevronDown
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                                        openIndex === index ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="px-8 pb-6">
                                    <div className="w-full h-px bg-gray-800 mb-6"></div>
                                    <p className="text-gray-300 leading-relaxed font-light">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
