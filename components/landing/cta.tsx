import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ChevronRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-card border-[3px] border-card-border rounded-[4px] shadow-[8px_8px_0_theme(colors.cyber-green)] p-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyber-green/10 border-[3px] border-cyber-green rounded-[4px] mb-6">
            <Shield className="w-8 h-8 text-cyber-green" />
          </div>

          <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Protecting Yourself Today
          </h2>

          <p className="font-mono text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who trust Cipherium to detect phishing
            attempts in their messages and calls.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Create Free Account
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="font-mono text-3xl font-bold text-cyber-green">
                1000+
              </p>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Scam Patterns
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-cyber-blue">
                10+
              </p>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Indian Languages
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-cyber-purple">
                99%
              </p>
              <p className="font-mono text-xs text-muted-foreground uppercase">
                Detection Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
