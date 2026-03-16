import { Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguageBadgeProps {
  language: string | null;
}

export function LanguageBadge({ language }: LanguageBadgeProps) {
  if (!language) return null;

  const langInfo = SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === language.toLowerCase()
  );

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border-[2px] border-card-border rounded-[4px]">
      <Languages className="w-4 h-4 text-cyber-blue" />
      <span className="font-mono text-sm text-foreground">
        {langInfo?.name || language}
      </span>
      {langInfo?.native && langInfo.native !== langInfo.name && (
        <span className="font-mono text-sm text-muted-foreground">
          ({langInfo.native})
        </span>
      )}
    </div>
  );
}
