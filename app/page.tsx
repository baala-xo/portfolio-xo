import { IdentityCard } from "@/components/identity-card"
import { ProjectCard } from "@/components/project-card"
import { EducationSection } from "@/components/education-section"
import { SkillsSection } from "@/components/skills-section"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AboutSection } from "@/components/about-section"
import { Hind_Madurai } from 'next/font/google';

const hindMadurai = Hind_Madurai({
  subsets: ['tamil'], // Important: Includes the Tamil characters
  weight: ['400', '700'] // Specify weights you want to use, e.g., regular (400) and bold (700)
});

export default function Portfolio() {
 

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                {/* Hidden on mobile screens */}
                <h1 className="text-5xl md:text-6xl font-bold leading-tight hidden md:block">Hi, Balachandar here</h1>
                <p className="text-xl text-muted-foreground hidden md:block">{"//"}</p>
                {/* Visible on mobile screens */}
                <h1 className="text-4xl font-bold leading-tight block md:hidden">Hello :)</h1>
                <p className={`${hindMadurai.className} text-lg text-muted-foreground block md:hidden`}>
  {"வணக்கம்"}
</p>
                <p className="text-lg text-muted-foreground block md:hidden">{"//"}</p>
              </div>
            </div>

            {/* Right Content - Enhanced ID Card */}
            <div className="flex justify-center lg:justify-end">
              <IdentityCard />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pb-32 space-y-12">
        <AboutSection />
        <SkillsSection />
        {/* Projects Section - Enhanced with numbered indicators */}
        <section id="projects" className="space-y-8">
          <h2 className="text-2xl font-bold">Cool projects I built</h2>
          <div className="space-y-6">
            <ProjectCard
              number={1}
              title="Ula - Taxi Booking App"
              description="Engineered a modern taxi application with React for a polished user interface, catering to both customer ride booking and driver management workflows."
              technologies={["NextJS", "Supabase", "ShadCN", "TailwindCSS", "Google-OAuth", "Vercel", "Leaflet-maps"]}
              link="https://taxi-app-steel.vercel.app/"
              status="building"
            />

            <ProjectCard
              number={2}
              title="Libry - Link Organization Tool"
              description="A modern web application to store, organize, and manage your important links with categories, tags, and search functionality."
              technologies={["NextJS", "TailwindCSS", "ShadCN", "Supabase", "TypeScript"]}
              link="https://libry-one.vercel.app/" // Placeholder: Add your Libry project link here
              status="building"
            />

            <ProjectCard
              number={3}
              title="AI Chatbot Widget"
              description="Built a floating chatbot widget with persistent memory and smart LLM responses. Integrated via a reusable component."
              technologies={["NextJS", "MistralAI-model", "Redis Upstash", "TailwindCSS", "Vercel"]}
              link="https://ai-chatbot-widget-5ga9cof84-baalaxos-projects.vercel.app/"
            />

            <ProjectCard
              number={4}
              title="Brain Tumor Detection CNN"
              description="Developed a CNN model with ResNet18 to classify MRI brain scans into 4 categories. Deployed via Gradio for real-time predictions."
              technologies={["Python", "Huggingface", "PyTorch"]}
              academic={true}
              documentationLink="https://drive.google.com/file/d/1jtARaGP96VnjdGvgIfjZL4skjE2fPLsl/view?usp=drive_link" // Placeholder: Add your Google Drive link for Brain Tumor Detection docs
            />
          </div>
        </section>
        <EducationSection />
      </div>

      <Footer />
      <BottomNavigation />
    </div>
  )
}
