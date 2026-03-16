import { Card } from "@/components/ui/card";
import {
  Languages,
  Mic,
  Image,
  Gauge,
  Link2,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "Multi-Language Detection",
    description:
      "Supports Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, and more Indian languages.",
    shadow: "green" as const,
  },
  {
    icon: Mic,
    title: "Voice Call Analysis",
    description:
      "Upload audio recordings of suspicious calls for voice phishing (vishing) detection.",
    shadow: "blue" as const,
  },
  {
    icon: Image,
    title: "Screenshot OCR",
    description:
      "Extract and analyze text from WhatsApp, SMS, or social media screenshots automatically.",
    shadow: "purple" as const,
  },
  {
    icon: Gauge,
    title: "Real-Time Risk Scoring",
    description:
      "Get instant risk scores with visual indicators showing safe, suspicious, or high-risk content.",
    shadow: "yellow" as const,
  },
  {
    icon: Link2,
    title: "Suspicious Link Detection",
    description:
      "Identifies fake bank URLs, shortened links, and phishing domains in messages.",
    shadow: "red" as const,
  },
  {
    icon: Brain,
    title: "Manipulation Tactics",
    description:
      "Detects urgency, fear, authority, and greed tactics used by scammers.",
    shadow: "blue" as const,
  },
];

export function Features() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered tools to protect you from phishing and scam
            attempts in any Indian language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              shadow={feature.shadow}
              className="p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
            >
              <div className="p-3 bg-muted rounded-[4px] w-fit mb-4">
                <feature.icon className="w-6 h-6 text-cyber-green" />
              </div>
              <h3 className="font-mono text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="font-mono text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
