import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Link2 } from "lucide-react";

export function DemoPreview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Cipherium analyzes suspicious messages in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Input */}
          <Card shadow="blue" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground uppercase">
                Suspicious Message
              </span>
            </div>
            <div className="bg-muted border-[2px] border-card-border rounded-[4px] p-4 font-mono text-sm leading-relaxed">
              <p className="text-foreground">
                Dear Customer, your{" "}
                <mark className="px-1 bg-cyber-red/20 border border-cyber-red text-cyber-red rounded">
                  SBI account
                </mark>{" "}
                will be{" "}
                <mark className="px-1 bg-cyber-red/20 border border-cyber-red text-cyber-red rounded">
                  blocked within 24 hours
                </mark>
                .{" "}
                <mark className="px-1 bg-cyber-yellow/20 border border-cyber-yellow text-cyber-yellow rounded">
                  Update KYC immediately
                </mark>
                :{" "}
                <mark className="px-1 bg-cyber-red/20 border border-cyber-red text-cyber-red rounded">
                  http://sbi-kyc-upd8.tk
                </mark>
              </p>
              <p className="mt-2 text-foreground">
                <mark className="px-1 bg-cyber-red/20 border border-cyber-red text-cyber-red rounded">
                  Share OTP
                </mark>{" "}
                with our agent:{" "}
                <mark className="px-1 bg-cyber-yellow/20 border border-cyber-yellow text-cyber-yellow rounded">
                  +91 98765 43210
                </mark>
              </p>
            </div>
          </Card>

          {/* Output */}
          <Card shadow="red" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyber-red" />
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Analysis Result
                </span>
              </div>
              <Badge level="high_risk" />
            </div>

            <div className="space-y-4">
              {/* Risk Score */}
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <p className="font-mono text-5xl font-bold text-cyber-red">
                    92
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    Risk Score
                  </p>
                </div>
              </div>

              {/* Threats */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-cyber-red/10 border border-cyber-red/30 rounded-[4px]">
                  <AlertTriangle className="w-4 h-4 text-cyber-red" />
                  <span className="font-mono text-xs text-cyber-red">
                    OTP Request Detected
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-cyber-red/10 border border-cyber-red/30 rounded-[4px]">
                  <Link2 className="w-4 h-4 text-cyber-red" />
                  <span className="font-mono text-xs text-cyber-red">
                    Fake Bank URL Detected
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-[4px]">
                  <AlertTriangle className="w-4 h-4 text-cyber-yellow" />
                  <span className="font-mono text-xs text-cyber-yellow">
                    Urgency Tactic Used
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
