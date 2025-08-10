"use client"

import { usePathname } from "next/navigation"
import HideOnScrollNavbar from "@/components/navbar-hide-on-scroll"

export default function ConditionalNavbar() {
    const pathname = usePathname()

    // Hide main navbar on admin pages
    if (pathname?.startsWith("/admin")) {
        return null
    }

    return <HideOnScrollNavbar />
}
