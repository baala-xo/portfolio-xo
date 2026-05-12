"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { IdentityCard } from "@/components/identity-card"
import { GithubActivityBadge } from "@/components/github-activity-badge"
import { EnhancedProjectCard } from "@/components/enhanced-project-card"
import { EducationSection } from "@/components/education-section"
import { SkillsSection } from "@/components/skills-section"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AboutSection } from "@/components/about-section"
import { Hind_Madurai } from "next/font/google"
import { SignatureWall } from "@/components/signature-wall"
import { MusicPlayer } from "@/components/music-player"
import { MusicIntroPopup } from "@/components/music-intro-popup"
import { ArcadeTrigger } from "@/components/arcade-trigger"
import { DudeHandMoment } from "@/components/dude-hand-moment"
import MagneticWrapper from "@/components/atomixui/magnetic-wrapper"
import { useMusicAccent } from "@/hooks/use-music-accent"
import Snowfall from "react-snowfall"

const hindMadurai = Hind_Madurai({
  subsets: ["tamil"],
  weight: ["400", "700"],
})

const smoothScrollFade = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  transition: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

const heroFromBottom = {
  initial: {
    opacity: 0,
    y: 30,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  transition: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

const projectStagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export default function Portfolio() {
  // Snowfall takes its drift color from whichever track is currently active.
  const accent = useMusicAccent("#8a2be2")

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient Snowfall — colour tracks the music accent */}
      <Snowfall
        color={accent}
        snowflakeCount={8}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <MusicPlayer />
      <MusicIntroPopup />
      <ArcadeTrigger />
      <DudeHandMoment />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Restored original positioning and spacing */}
            <motion.div className="space-y-8" initial="initial" animate="animate" variants={heroFromBottom}>
              <div className="space-y-4">
                {/* Hidden on mobile screens */}
                <h1 className="text-5xl md:text-6xl font-bold leading-tight hidden md:block">Hello :)</h1>
                <p className={`${hindMadurai.className} text-xl text-muted-foreground hidden md:block`}>{"🩵"}</p>
                <p className={`${hindMadurai.className} text-sm text-gray-400 italic hidden md:block`}>
                  {"தெய்வத்தான் ஆகா தெனினும் முயற்சிதன் மெய்வருத்தக் கூலி தரும் (குறள் 619)"}
                </p>
                {/* Visible on mobile screens */}
                <h1 className="text-4xl font-bold leading-tight block md:hidden">Hello :)</h1>
                <p className={`${hindMadurai.className} text-lg text-muted-foreground block md:hidden`}>
                  {" "}
                  {"🩵"}
                </p>
                <p className={`${hindMadurai.className} text-xs text-gray-400 italic block md:hidden`}>
                  {"தெய்வத்தான் ஆகா தெனினும் முயற்சிதன் மெய்வருத்தக் கூலி தரும் (குறள் 619)"}
                </p>
              </div>
            </motion.div>
            {/* Right Content - Enhanced ID Card - Restored original positioning */}
            <motion.div
              className="flex flex-col items-center gap-4 lg:items-end"
              initial="initial"
              animate="animate"
              variants={heroFromBottom}
            >
              <MagneticWrapper elasticity={0.5}>
                <div>
                  <IdentityCard />
                </div>
              </MagneticWrapper>
              <div className="w-full max-w-[520px]">
                <GithubActivityBadge username="baala-xo" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pb-32 space-y-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          variants={smoothScrollFade}
        >
          <AboutSection />
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          variants={smoothScrollFade}
        >
          <SkillsSection />
        </motion.div>

        {/* Products Section - team work shipping in production */}
        <motion.section
          id="products"
          className="space-y-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          variants={projectStagger}
        >
          <motion.h2 className="text-2xl font-bold" variants={smoothScrollFade}>
            Products I&apos;m part of
          </motion.h2>
          <motion.div className="space-y-6">
            <motion.div variants={smoothScrollFade}>
              <EnhancedProjectCard
                number={1}
                title="mysamantha.ai"
                description="Your second brain, but it's an AI. Notes, tasks, journals, and inbox automation in one place. I'm part of the engineering team. mostly UI on the Next.js web app and Android client, with backend cameos when the situation calls for it."
                technologies={["Next.js", "React", "TypeScript", "TailwindCSS", "Android"]}
                link="https://mysamantha.ai"
                status="building"
                metric="Used by 3,500+ humans"
                thumbnailUrl="/products/mysamantha-hero.avif"
                thumbnailFit="contain"
                thumbnailBg="black"
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Projects Section - Enhanced with all new features */}
        <motion.section
          id="projects"
          className="space-y-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          variants={projectStagger}
        >
          <motion.h2 className="text-2xl font-bold" variants={smoothScrollFade}>
            Cool projects I built
          </motion.h2>
          <motion.div className="space-y-6">
            <motion.div variants={smoothScrollFade}>
              <EnhancedProjectCard
                number={1}
                title="Brain Tumor Detection CNN"
                description="Developed a brain tumor detection platform integrating a Hugging Face–hosted FastAPI backend with a modern Next.js App Router frontend styled using shadcn/ui. Enables seamless MRI image uploads, real-time inference through an ONNX model, and clear visual feedback of predictions. Currently building a gatekeeper model to validate incoming MRI scans before processing, ensuring data quality and improving overall prediction reliability. The system has undergone multiple iterations, with significant updates such as replacing the ResNet50 backbone with a more efficient ResNet18 architecture to enhance inference speed and reduce computational overhead. These iterative improvements, while impactful, are not yet fully reflected in earlier documentation, marking this as an evolving academic project with continuous optimization."
                technologies={[
                  "Python",
                  "NextJS",
                  "Huggingface",
                  "PyTorch",
                  "ONNX",
                  "FastAPI",
                  "Resnet50",
                  "Vercel",
                  "kaggle",
                  "ShadCN",
                  "TailwindCSS",
                ]}
                academic={true}
                link="https://brain-tumor-detection-v2.vercel.app/"
                documentationLink="https://drive.google.com/file/d/1jtARaGP96VnjdGvgIfjZL4skjE2fPLsl/view?usp=drive_link"
                status="building"
                thumbnailUrl="/projects/brain-tumor-detection.png"
                lastUpdated="1 week ago"
              />
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          variants={smoothScrollFade}
        >
          <EducationSection />
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
          variants={smoothScrollFade}
        >
          <SignatureWall />
        </motion.div>
      </div>

      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px", amount: 0.2 }}
        variants={smoothScrollFade}
      >
        <Footer />
      </motion.div>
      <BottomNavigation />
    </div>
  )
}
