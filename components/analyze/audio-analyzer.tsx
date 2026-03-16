"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { Loader2, Mic, X } from "lucide-react";

export function AudioAnalyzer() {
  const [files, setFiles] = useState<File[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFiles = useCallback((newFiles: File[]) => {
    // Revoke previous object URL to avoid memory leaks
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFiles(newFiles);
    if (newFiles.length > 0) {
      setAudioUrl(URL.createObjectURL(newFiles[0]));
    } else {
      setAudioUrl(null);
    }
  }, [audioUrl]);

  const clearAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFiles([]);
    setAudioUrl(null);
  };

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Audio analysis failed";
      toast(message, "error");
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

      {files.length > 0 && audioUrl ? (
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3 bg-muted border-[2px] border-card-border rounded-[4px] p-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-cyber-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-foreground truncate font-bold">{files[0].name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {(files[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={clearAudio}
              className="p-1 text-muted-foreground hover:text-cyber-red transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Audio preview player */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls className="w-full h-10" src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <FileUpload
          accept="audio/*,.mp3,.wav,.ogg,.m4a,.webm"
          maxSize={25}
          onFiles={handleFiles}
          label="Drop audio file here"
          description="MP3, WAV, OGG, M4A, WebM supported"
        />
      )}

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
