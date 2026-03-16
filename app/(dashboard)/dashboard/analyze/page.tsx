"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { TextAnalyzer } from "@/components/analyze/text-analyzer";
import { AudioAnalyzer } from "@/components/analyze/audio-analyzer";
import { ImageAnalyzer } from "@/components/analyze/image-analyzer";
import { FileText, Mic, Image } from "lucide-react";

const tabs = [
  { id: "text", label: "Text", icon: <FileText className="w-4 h-4" /> },
  { id: "audio", label: "Audio", icon: <Mic className="w-4 h-4" /> },
  { id: "image", label: "Image", icon: <Image className="w-4 h-4" /> },
];

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState("text");
  const [extensionImage, setExtensionImage] = useState<string | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const searchParams = useSearchParams();

  // Listen for screenshots from Chrome extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "cipherium-screenshot" && event.data.imageDataUrl) {
        setExtensionImage(event.data.imageDataUrl);
        setActiveTab("image");
        setAutoAnalyze(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Check if we came from extension
  useEffect(() => {
    if (searchParams.get("source") === "extension") {
      setActiveTab("image");
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold text-foreground">
          New Analysis
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          Analyze suspicious content for phishing indicators
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div>
        {activeTab === "text" && <TextAnalyzer />}
        {activeTab === "audio" && <AudioAnalyzer />}
        {activeTab === "image" && (
          <ImageAnalyzer
            initialImageDataUrl={extensionImage}
            autoAnalyze={autoAnalyze}
          />
        )}
      </div>

      {/* Tips */}
      <div className="bg-muted border-[2px] border-card-border rounded-[4px] p-4">
        <h3 className="font-mono text-sm font-bold text-foreground mb-2">
          Tips for better analysis
        </h3>
        <ul className="font-mono text-xs text-muted-foreground space-y-1">
          <li>• Include the complete message for accurate detection</li>
          <li>• Audio files work best in MP3 or WAV format</li>
          <li>• For screenshots, ensure text is clearly visible</li>
          <li>• Supports Hindi, Marathi, Tamil, Telugu, Bengali, and more</li>
        </ul>
      </div>
    </div>
  );
}
