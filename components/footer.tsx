"use client"
import Link from "next/link"
import { Youtube, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-black border-t border-gray-800 px-6 py-12 md:px-12">
            <div className="max-w-6xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div>
                                <div>
                                    <img src="/Logo.png" alt="logo" className="h-12 w-auto border-gray-700 border rounded"/>
                                </div>
                                <p className="text-gray-400 text-sm py-5 font-light">Association of Computing Technology and Science</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-light text-white mb-4 tracking-wide">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#About" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/ourJourney"
                                    className="text-gray-400 hover:text-white transition-colors text-sm font-light"
                                >
                                    Our Journey
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                                    Join Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-light text-white mb-4 tracking-wide">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-400 text-sm font-light">
                                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                                <a href="mailto:info@acts.edu" className="hover:text-white transition-colors">
                                    acts.edc@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start text-gray-400 text-sm font-light">
                                <MapPin className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
                                <span>
                  GGSIPU East Delhi Campus
                  <br />
                  New Delhi, India
                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media and Copyright */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Social Media Links */}
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400 text-sm font-light">Follow us:</span>
                            <div className="flex space-x-3">
                                <a
                                    href="https://www.youtube.com/@ACTS-EDCSC"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800/50 hover:bg-red-600/20 border border-gray-700 hover:border-red-600/50 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <Youtube className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                                </a>
                                <a
                                    href="https://www.instagram.com/acts_edc/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800/50 hover:bg-pink-600/20 border border-gray-700 hover:border-pink-600/50 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <Instagram className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/acts-edc/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-600/50 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                </a>
                                <a
                                    href="mailto:acts.edc@gmail.com"
                                    className="w-9 h-9 bg-gray-800/50 hover:bg-green-600/20 border border-gray-700 hover:border-green-600/50 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                                </a>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-center md:text-right">
                            <p className="text-gray-500 text-sm font-light">
                                © {new Date().getFullYear()} ACTS. All rights reserved.
                            </p>
                            <p className="text-gray-600 text-xs font-light mt-1">Made with ❤️ by ACTS Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
