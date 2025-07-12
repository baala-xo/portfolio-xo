import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Balachandar V - Full-Stack Developer",
  description:
    "Passionate Postgraduate with a strong foundation in full-stack development and AI integration. Portfolio showcasing modern web applications and innovative projects.",
  keywords: ["Full-Stack Developer", "React", "Next.js", "AI Integration", "Web Development"],
  authors: [{ name: "Balachandar V" }],
  creator: "Balachandar V",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-ochre-nu-66.vercel.app",
    title: "Balachandar V - Full-Stack Developer",
    description: "Passionate Postgraduate with a strong foundation in full-stack development and AI integration.",
    siteName: "Balachandar V Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balachandar V - Full-Stack Developer",
    description: "Passionate Postgraduate with a strong foundation in full-stack development and AI integration.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
