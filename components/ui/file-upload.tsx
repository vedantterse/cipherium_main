"use client";

import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { useCallback, useState, useRef } from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFiles: (files: File[]) => void;
  className?: string;
  label?: string;
  description?: string;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize = 25,
  onFiles,
  className,
  label = "Upload Files",
  description = "Drag and drop or click to browse",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const validFiles: File[] = [];
      for (const file of Array.from(files)) {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} exceeds ${maxSize}MB limit`);
          continue;
        }
        validFiles.push(file);
      }
      if (!multiple && validFiles.length > 1) {
        validFiles.splice(1);
      }
      setSelectedFiles(validFiles);
      onFiles(validFiles);
    },
    [maxSize, multiple, onFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFiles(newFiles);
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-[3px] border-dashed rounded-[4px] p-8 text-center cursor-pointer",
          "transition-all duration-200",
          isDragging
            ? "border-cyber-green bg-cyber-green/5 shadow-[0_0_20px_rgba(0,255,65,0.15)]"
            : "border-card-border hover:border-muted-foreground"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <Upload
          className={cn(
            "w-10 h-10 mx-auto mb-3",
            isDragging ? "text-cyber-green" : "text-muted-foreground"
          )}
        />
        <p className="font-mono font-bold text-sm">{label}</p>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          {description}
        </p>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Max {maxSize}MB {accept && `| ${accept}`}
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-muted border-[2px] border-card-border rounded-[4px] px-3 py-2"
            >
              <span className="font-mono text-xs text-foreground truncate">
                {file.name}{" "}
                <span className="text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-muted-foreground hover:text-cyber-red ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
