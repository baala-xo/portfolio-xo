import { FaXTwitter } from "react-icons/fa6"

export function Footer() {
  return (
    <footer className="py-20">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-8 my-9">
        <div className="w-12 h-0.5 bg-muted mx-auto" />

        <p className="text-muted-foreground">
          {" "} 
          <a href="/" className="text-primary ">
           Reload
          </a>
           
        </p>
      </div>
    </footer>
  )
}
