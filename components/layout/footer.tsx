import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-card-border bg-card/50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-green" />
            <span className="font-mono text-sm text-muted-foreground">
              CIPHERIUM - AI Phishing Shield
            </span>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Built for Cybersecurity Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
