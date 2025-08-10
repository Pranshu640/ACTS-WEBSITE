"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, Settings, Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { removeAuthToken } from "@/lib/auth"

export default function AdminNavbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        removeAuthToken()
        router.push("/admin/login")
    }

    const navItems = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            active: pathname === "/admin",
        },
        {
            name: "Hero Section",
            href: "/admin/hero",
            icon: Home,
            active: pathname?.startsWith("/admin/hero"),
        },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link href="/admin" className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-light text-white tracking-wide">ACTS Admin</h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 ${
                                        item.active ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-light">{item.name}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* Right side - Mobile menu + Logout */}
                    <div className="flex items-center space-x-2">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800/50"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>

                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="font-light">Admin Panel</span>
                        </div>

                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-800/50 py-4">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start flex items-center space-x-3 px-4 py-3 transition-all duration-300 ${
                                            item.active ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-light">{item.name}</span>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
