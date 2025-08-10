"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "What is ACTS?",
        answer:
            "ACTS (Association of Technical Computing and Science) is a vibrant technical club at Guru Gobind Singh Indraprastha University, East Delhi Campus. The club focuses on AI, Machine Learning, Automation, and Robotics, providing students with a platform to learn, innovate, and grow in these cutting-edge technologies.",
    },
    {
        question: "How can students join ACTS?",
        answer:
            "Students can join ACTS by attending club events, reaching out to current members, or contacting the leadership team directly. The club welcomes students from all academic backgrounds who have an interest in technology and innovation, regardless of their current skill level.",
    },
    {
        question: "What benefits do ACTS members receive?",
        answer:
            "ACTS members gain access to hands-on workshops, hackathons, technical seminars, and career development sessions including resume building and interview preparation. Members also benefit from networking opportunities with industry professionals and mentorship from faculty advisors Dr. Neeta Singh and Dr. Amar Arora.",
    },
    {
        question: "How frequently does ACTS organize events?",
        answer:
            "ACTS maintains an active event schedule throughout the academic year, organizing regular workshops, technical talks, hackathons, and career development sessions. The club also hosts special events and competitions based on emerging technologies and student interests.",
    },
    {
        question: "Can students take leadership roles in ACTS?",
        answer:
            "Yes, ACTS encourages student participation in leadership and organizational roles. Students can contribute by helping organize events, leading workshops, joining committees, or applying for core team positions. The club values initiative and provides opportunities for students to develop leadership skills.",
    },
    {
        question: "Do students need prior technical experience to join ACTS?",
        answer:
            "No prior technical experience is required to join ACTS. The club welcomes students at all skill levels, from beginners who are curious about technology to those with advanced programming knowledge. ACTS believes in collaborative learning and provides support for students to develop their technical skills progressively.",
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
