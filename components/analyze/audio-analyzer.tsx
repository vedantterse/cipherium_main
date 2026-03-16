"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { Loader2, Mic } from "lucide-react";

export function AudioAnalyzer() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast("Please select an audio file", "warning");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch("/api/analyze/audio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      toast("Audio analyzed successfully!", "success");
      router.push(`/dashboard/report/${data.analysisId}`);
    } catch (err: any) {
      toast(err.message || "Audio analysis failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="blue" className="p-6">
      <div className="mb-4">
        <h3 className="font-mono text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">
          Upload Audio Recording
        </h3>
        <p className="font-mono text-xs text-muted-foreground">
          Upload a voice call recording or voice message to detect vishing (voice phishing) attempts.
        </p>
      </div>

      <FileUpload
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.webm"
        maxSize={25}
        onFiles={setFiles}
        label="Drop audio file here"
        description="MP3, WAV, OGG, M4A, WebM supported"
      />

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={loading || files.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Transcribing & Analyzing...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Analyze Audio
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
