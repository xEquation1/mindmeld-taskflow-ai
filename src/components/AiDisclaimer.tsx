import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs italic text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        AI-generated content can occasionally be inaccurate. Please validate all information and
        remove sensitive data before sharing.
      </span>
    </div>
  );
}
