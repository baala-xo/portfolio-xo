

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ConvexClientProvider from "./convex-provider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jesse Pinkman's Portfolio",
  description:
    "Passionate Postgraduate with a strong foundation in full-stack development and AI integration. Portfolio showcasing modern web applications and innovative projects.",
  keywords: ["Full-Stack Developer", "React", "Next.js", "AI Integration", "Web Development"],
  authors: [{ name: "vinsmoke" }],
  creator: "Jesse Pinkman",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://portfolio-ochre-nu-66.vercel.app",
    title: "Jesse Pinkman's Portfolio",
    description: "Passionate Postgraduate with a strong foundation in full-stack development and AI integration.",
    siteName: "Slippinjimmy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesse Pinkman's Portfolio",
    description: "Passionate Postgraduate with a strong foundation in full-stack development and AI integration.",
  },
  generator: 'xo'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}><ConvexClientProvider>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ConvexClientProvider>

      </body>
    </html>
  )
}
