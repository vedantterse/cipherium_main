"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { TextAnalyzer } from "@/components/analyze/text-analyzer";
import { AudioAnalyzer } from "@/components/analyze/audio-analyzer";
import { ImageAnalyzer } from "@/components/analyze/image-analyzer";
import { FileText, Mic, Image } from "lucide-react";

const tabs = [
  { id: "text", label: "Text", icon: <FileText className="w-4 h-4" /> },
  { id: "audio", label: "Audio", icon: <Mic className="w-4 h-4" /> },
  { id: "image", label: "Image / Screenshot", icon: <Image className="w-4 h-4" /> },
];

function AnalyzeContent() {
  const [activeTab, setActiveTab] = useState("text");
  const [extensionImage, setExtensionImage] = useState<string | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const searchParams = useSearchParams();

  // Check if we came from extension
  useEffect(() => {
    if (searchParams.get("source") === "extension") {
      setActiveTab("image");
    }
  }, [searchParams]);

  // Listen for screenshots from Chrome extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "cipherium-screenshot" && event.data.imageDataUrl) {
        setExtensionImage(event.data.imageDataUrl);
        setActiveTab("image");
        setAutoAnalyze(true);
        // Send acknowledgment so content script stops retrying
        window.postMessage({ type: "cipherium-ack" }, "*");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold text-foreground">New Analysis</h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          Analyze suspicious content for phishing indicators
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {activeTab === "text" && <TextAnalyzer />}
        {activeTab === "audio" && <AudioAnalyzer />}
        {activeTab === "image" && (
          <ImageAnalyzer initialImageDataUrl={extensionImage} autoAnalyze={autoAnalyze} />
        )}
      </div>

      <div className="bg-muted border-[2px] border-card-border rounded-[4px] p-4">
        <h3 className="font-mono text-sm font-bold text-foreground mb-2">Tips for better analysis</h3>
        <ul className="font-mono text-xs text-muted-foreground space-y-1">
          <li>• <span className="text-foreground font-bold">Text:</span> Paste the complete suspicious message for accurate detection</li>
          <li>• <span className="text-foreground font-bold">Audio:</span> MP3 or WAV format work best (max 25 MB)</li>
          <li>• <span className="text-foreground font-bold">Image:</span> Ensure text in screenshots is clearly visible (max 10 MB)</li>
          <li>• Supports Hindi, Marathi, Tamil, Telugu, Bengali, and more Indian languages</li>
        </ul>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-12 w-full bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted rounded animate-pulse" />
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}
