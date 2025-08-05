// components/LogoSplash.tsx
'use client'

import React from 'react'

const SVG_FILES = ['/shape-a.svg', '/shape-b.svg', '/shape-c.svg']

export default function LogoSplash() {
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="relative w-32 h-32 bg-black rounded-lg overflow-hidden ">

                    <div className="flex items-center justify-center w-full h-full">
                        <h1 className="text-white text-4xl font-extrabold">ACTS</h1>
                    </div>
                    <img src={SVG_FILES[1]} alt="logo" className="absolute bottom-0 right-0 h-11 w-11 translate-x-1/8 translate-y-1/4" />
                    <img src={SVG_FILES[2]} alt="logo" className="absolute top-0 right-0 h-18 w-16 translate-x-1/8 translate-y-0" />
                    <img src={SVG_FILES[0]} alt="logo" className="absolute bottom-0 left-0 h-16 w-16" />

                </div>
            </div>
        </div>
    )
}
