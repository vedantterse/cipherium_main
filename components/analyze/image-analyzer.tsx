"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { Loader2, ImageIcon, X } from "lucide-react";

interface ImageAnalyzerProps {
  initialImageDataUrl?: string | null;
  autoAnalyze?: boolean;
}

export function ImageAnalyzer({ initialImageDataUrl, autoAnalyze }: ImageAnalyzerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(initialImageDataUrl || null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImageDataUrl || null);
  const { toast } = useToast();
  const router = useRouter();
  const hasAutoAnalyzed = useRef(false);

  // Handle file selection
  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setImageDataUrl(null); // Clear any extension image
      };
      reader.readAsDataURL(newFiles[0]);
    } else {
      setPreview(initialImageDataUrl || null);
    }
  }, [initialImageDataUrl]);

  // Auto-analyze when image comes from extension
  const handleSubmit = useCallback(async () => {
    if (files.length === 0 && !imageDataUrl) {
      toast("Please select an image file", "warning");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (files.length > 0) {
        formData.append("file", files[0]);
      } else if (imageDataUrl) {
        // Convert data URL to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], "screenshot.png", { type: "image/png" });
        formData.append("file", file);
      }

      const res = await fetch("/api/analyze/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      toast("Image analyzed successfully!", "success");
      router.push(`/dashboard/report/${data.analysisId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Image analysis failed";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [files, imageDataUrl, toast, router]);

  // Auto-analyze if initialImageDataUrl provided and autoAnalyze is true
  if (initialImageDataUrl && autoAnalyze && !hasAutoAnalyzed.current && !loading) {
    hasAutoAnalyzed.current = true;
    setTimeout(handleSubmit, 500);
  }

  const clearImage = () => {
    setFiles([]);
    setPreview(null);
    setImageDataUrl(null);
  };

  const hasImage = files.length > 0 || imageDataUrl;

  return (
    <Card shadow="purple" className="p-6">
      <div className="mb-4">
        <h3 className="font-mono text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">
          Upload Screenshot
        </h3>
        <p className="font-mono text-xs text-muted-foreground">
          Upload a screenshot of a suspicious WhatsApp, SMS, or social media message.
          AI will extract and analyze the text automatically.
        </p>
      </div>

      {preview ? (
        <div className="relative mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-[300px] object-contain rounded-[4px] border-[2px] border-card-border"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-background/90 rounded-full border border-card-border hover:bg-cyber-red/20 hover:border-cyber-red transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <FileUpload
          accept="image/*,.png,.jpg,.jpeg,.webp"
          maxSize={10}
          onFiles={handleFiles}
          label="Drop screenshot here"
          description="PNG, JPG, WebP supported"
        />
      )}

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={loading || !hasImage}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Extracting & Analyzing...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Analyze Image
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
