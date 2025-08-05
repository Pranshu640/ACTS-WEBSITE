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
    { name: "About", href: "#about", icon: User },
    { name: "Teams", href: "#team", icon: Settings },
    { name: "Events", href: "/ourJourney", icon: Settings },
    { name: "Contacts", href: "#footer", icon: Mail },
  ]

  return (
      <>
        <nav
            className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-black/20 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <h1 className="text-4xl font-bold text-white">ACTS</h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block flex-1">
                <div className="flex items-center justify-center space-x-8">
                  {navItems.map((item) => (
                      <a
                          key={item.name}
                          href={item.href}
                          className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                  ))}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open main menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col space-y-4 mt-8">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
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
