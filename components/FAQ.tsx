"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "What exactly is ACTS?",
        answer:
            "ACTS is our college's tech club at GGSIPU East Delhi Campus! We're all about AI, Machine Learning, Automation, and Robotics. Think of us as your go-to community for everything tech - from learning cool stuff together to building awesome projects and getting career-ready.",
    },
    {
        question: "How do I join ACTS?",
        answer:
            "Great question! We're always looking for enthusiastic students who love tech. Just reach out to any of our team members, attend one of our events, or drop us a message. We're pretty welcoming - whether you're a coding pro or just starting your tech journey!",
    },
    {
        question: "What's in it for me as a member?",
        answer:
            "Oh, where do I start! You'll get hands-on workshops, hackathons, resume building sessions, interview prep, and networking with industry folks. Plus, you'll be part of a community that actually cares about your growth. And hey, it looks pretty good on your resume too!",
    },
    {
        question: "How often do you guys organize events?",
        answer:
            "We're pretty active! We host workshops and tech talks regularly, organize hackathons, career development sessions, and some fun tech meetups. Follow us to stay updated - we're always cooking up something interesting for our members.",
    },
    {
        question: "Can I get involved in organizing stuff?",
        answer:
            "Absolutely! We love students who want to take initiative. Whether you want to help organize events, lead a workshop, or even join our core team - there's always room for passionate people. Just talk to any of our team members, we're always happy to have more hands on deck!",
    },
    {
        question: "Do I need to be a coding expert to join?",
        answer:
            "Not at all! We have members from all skill levels. Whether you're a complete beginner curious about tech or someone who's been coding since high school - everyone's welcome. We believe in learning together and helping each other grow.",
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
