"use client"

import { IdentityCard } from "@/components/identity-card"
import { EnhancedProjectCard } from "@/components/enhanced-project-card"
import { EducationSection } from "@/components/education-section"
import { SkillsSection } from "@/components/skills-section"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AboutSection } from "@/components/about-section"
import { Hind_Madurai } from "next/font/google"
import DigitalGuestbook from "@/digital-guestbook"
import { motion } from "framer-motion"

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Restored original positioning and spacing */}
            <motion.div className="space-y-8" initial="initial" animate="animate" variants={heroFromBottom}>
              <div className="space-y-4">
                {/* Hidden on mobile screens */}
                <h1 className="text-5xl md:text-6xl font-bold leading-tight hidden md:block">Hello :)</h1>
                <p className={`${hindMadurai.className} text-xl text-muted-foreground hidden md:block`}>{"வணக்கம் 💜"}</p>
                <p className="text-xl text-muted-foreground hidden md:block">{"//"}</p>
                {/* Visible on mobile screens */}
                <h1 className="text-4xl font-bold leading-tight block md:hidden">Hello :)</h1>
                <p className={`${hindMadurai.className} text-lg text-muted-foreground block md:hidden`}>
                  {" "}
                  {"வணக்கம் 💜"}
                </p>
                <p className="text-lg text-muted-foreground block md:hidden">{"//"}</p>
              </div>
            </motion.div>
            {/* Right Content - Enhanced ID Card - Restored original positioning */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial="initial"
              animate="animate"
              variants={heroFromBottom}
            >
              <IdentityCard />
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
                        <motion.div variants={smoothScrollFade}>
              <EnhancedProjectCard
                number={4}
                title="AI Chatbot Widget"
                description="Built a floating chatbot widget with persistent memory and smart LLM responses. Integrated via a reusable component with customizable themes and advanced conversation management."
                technologies={["NextJS", "MistralAI-model", "Redis Upstash", "TailwindCSS", "Vercel"]}
                link="https://ai-chatbot-widget-5ga9cof84-baalaxos-projects.vercel.app/"
                status="completed"
                thumbnailUrl="/projects/ai-chatbot-widget.png"
                lastUpdated="3 months ago"
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
          <DigitalGuestbook />
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
