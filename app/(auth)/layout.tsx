import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-cyber-green/10 border-[3px] border-cyber-green rounded-[4px] flex items-center justify-center shadow-[4px_4px_0_theme(colors.cyber-green)]">
            <Shield className="w-7 h-7 text-cyber-green" />
          </div>
          <span className="font-mono font-bold text-2xl tracking-wider text-foreground">
            CIPHERIUM
          </span>
        </div>

        {/* Card */}
        <div className="bg-card border-[3px] border-card-border rounded-[4px] shadow-[6px_6px_0_theme(colors.cyber-green)] p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-muted-foreground mt-6">
          AI-Powered Phishing Shield for Indian Languages
        </p>
      </div>
    </div>
  );
}
