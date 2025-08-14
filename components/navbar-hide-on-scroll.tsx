"use client"

import { useState, useEffect } from "react"
import { Menu, Home, User, Settings, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function HideOnScrollNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at the top
        setIsVisible(true)
      } else {
        // Scrolling down
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/#about", icon: User },
    { name: "Teams", href: "/#team", icon: Settings },
    { name: "Events", href: "/ourJourney", icon: Settings },
    { name: "Contacts", href: "/#contact", icon: Mail },
  ]

  return (
    <>
      {/* Bubble Navbar with Glass Background */}
      <nav
        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
      >
        {/* Glass bubble container */}
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-2xl">
          <div className="flex items-center justify-between">
            {/* Logo */}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10 font-mono"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open main menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/90 backdrop-blur-md border-white/10">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 text-white/80 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-white/10 font-mono"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </a>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
