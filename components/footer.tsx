import MagneticWrapper from "@/components/atomixui/magnetic-wrapper"

export function Footer() {
  return (
    <footer className="py-20">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-8 my-9">
        <div className="w-12 h-0.5 bg-muted mx-auto" />

        <div className="text-muted-foreground flex justify-center">
          <MagneticWrapper>
            <a href="/" className="text-primary inline-block">
              Reload
            </a>
          </MagneticWrapper>
        </div>
      </div>
    </footer>
  )
}
