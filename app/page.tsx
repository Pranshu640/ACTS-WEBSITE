'use client'
import React from 'react'
import DemoHome from "@/components/Home";
import VisualsPage from "@/components/HighLights"
import FAQSection from "@/components/FAQ";
import LeadershipSection from "@/components/team";
import AskQuestionsSection from "@/components/askQuestion";
import SponsorsSection from "@/components/sponserSection";
import MentorSection from "@/components/mentors";
import AboutSection from "@/components/about";

export default function Page() {

    return (
        <div className="min-h-screen">
            {/* Hero section */}
            <section className="z-20" id="home" >
                <DemoHome/>
            </section>
            <section>
                <AboutSection/>
            </section>



            {/* Other Sections */}
            <section>
                <VisualsPage />
            </section>
            <section>
                <MentorSection />
            </section>

            <section id="team">
                <LeadershipSection />
            </section>
            
            <section>
                <SponsorsSection />
            </section>
            
            <section>
                <FAQSection />
            </section>
            
            <section>
                <AskQuestionsSection />
            </section>
        </div>
    )
}