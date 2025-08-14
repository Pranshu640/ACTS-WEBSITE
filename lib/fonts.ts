import { Pacifico, Poppins, JetBrains_Mono } from "next/font/google"

export const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
})

export const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: '--font-poppins'
})

export const jetbrainsMono = JetBrains_Mono({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: '--font-jetbrains-mono'
})
