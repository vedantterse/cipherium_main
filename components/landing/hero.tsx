"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ChevronRight, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const scamMessages = [
  "Dear Customer, your SBI account will be blocked. Update KYC: bit.ly/sbi-kyc",
  "आपने ₹50,00,000 की लॉटरी जीती है! OTP भेजें: +91 98765 43210",
  "URGENT: You have won Rs. 10 Lakh! Share OTP to claim prize.",
  "तुमचे खाते बंद होईल. आधार अपडेट करा: http://fake-aadhar.tk",
  "இலவச வேலை வாய்ப்பு! மாதம் ₹1 லட்சம் சம்பாதிக்கலாம்.",
];

export function Hero() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const message = scamMessages[currentMessage];
    if (isTyping) {
      if (displayText.length < message.length) {
        const timer = setTimeout(() => {
          setDisplayText(message.slice(0, displayText.length + 1));
        }, 30);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % scamMessages.length);
        setDisplayText("");
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayText, isTyping, currentMessage]);

  return (
    <section className="relative min-h-screen flex items-center justify-center cyber-grid overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-green/10 border-[2px] border-cyber-green/30 rounded-full mb-8">
          <Shield className="w-4 h-4 text-cyber-green" />
          <span className="font-mono text-xs text-cyber-green uppercase tracking-wider">
            AI-Powered Protection
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Phishing Shield for{" "}
          <span className="text-cyber-green glow-green">Indian Languages</span>
        </h1>

        {/* Subheading */}
        <p className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Detect scam messages and voice calls in Hindi, Marathi, Tamil, Telugu,
          Bengali and more using advanced AI.
        </p>

        {/* Terminal Demo */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-card border-[3px] border-card-border rounded-[4px] shadow-[6px_6px_0_theme(colors.cyber-green)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b-[2px] border-card-border">
              <div className="w-3 h-3 rounded-full bg-cyber-red" />
              <div className="w-3 h-3 rounded-full bg-cyber-yellow" />
              <div className="w-3 h-3 rounded-full bg-cyber-green" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                analyzing_message.txt
              </span>
            </div>
            <div className="p-4 min-h-[100px]">
              <div className="flex items-start gap-2">
                <Terminal className="w-4 h-4 text-cyber-green mt-1 shrink-0" />
                <p className="font-mono text-sm text-left text-foreground">
                  {displayText}
                  <span className="inline-block w-2 h-4 bg-cyber-green ml-1 animate-pulse" />
                </p>
              </div>
              {!isTyping && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-cyber-red/20 border border-cyber-red text-cyber-red font-mono text-xs rounded">
                    HIGH RISK
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Phishing detected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Get Started Free
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
