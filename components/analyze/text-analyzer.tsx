"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Loader2, Send } from "lucide-react";

export function TextAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast("Please enter some text to analyze", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      toast("Analysis complete!", "success");
      router.push(`/dashboard/report/${data.analysisId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="green" className="p-6">
      <form onSubmit={handleSubmit}>
        <label className="block font-mono text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">
          Paste suspicious message
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the suspicious SMS, WhatsApp message, or email content here...

Example:
Dear Customer, your SBI account will be blocked within 24 hours. Update KYC immediately: http://sbi-kyc-update.tk
Share OTP with our agent: +91 98765 43210"
          className="w-full h-48 bg-muted border-[3px] border-card-border rounded-[4px] p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-green resize-none"
          disabled={loading}
        />
        <div className="flex items-center justify-between mt-4">
          <p className="font-mono text-xs text-muted-foreground">
            {text.length}/10000 characters
          </p>
          <Button type="submit" variant="primary" disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze Text
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
