import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Sparkles, CheckCircle2, ListChecks, AlignLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — TaskMind" },
      {
        name: "description",
        content: "Turn messy meeting transcripts into summaries, decisions, and action items.",
      },
    ],
  }),
  component: NotesPage,
});

type Summary = {
  summary: string[];
  decisions: string[];
  actions: { task: string; owner?: string; due?: string }[];
};

function summarize(raw: string): Summary {
  const lines = raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const decisions = lines
    .filter((l) => /(decide|decided|agreed|approve|approved|go with|chose|final)/i.test(l))
    .slice(0, 5);

  const actions = lines
    .filter((l) =>
      /(will |to do|todo|action|follow up|send|prepare|draft|schedule|review|by |due |next week|tomorrow|monday|tuesday|wednesday|thursday|friday)/i.test(
        l,
      ),
    )
    .slice(0, 6)
    .map((l) => {
      const ownerMatch = l.match(/\b([A-Z][a-z]+)\b/);
      const dueMatch = l.match(/(by\s+[\w\s\d]+|next\s+\w+|tomorrow|monday|tuesday|wednesday|thursday|friday)/i);
      return {
        task: l.replace(/^[-*•]\s*/, ""),
        owner: ownerMatch?.[1],
        due: dueMatch?.[0],
      };
    });

  const summary = lines.slice(0, 3).map((l) => l.replace(/^[-*•]\s*/, ""));

  return {
    summary:
      summary.length > 0
        ? summary
        : ["Team discussed project status and aligned on next steps."],
    decisions:
      decisions.length > 0 ? decisions : ["No explicit decisions detected in the transcript."],
    actions:
      actions.length > 0
        ? actions
        : [{ task: "No clear action items detected — review transcript manually." }],
  };
}

function NotesPage() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Summary | null>(null);

  const handleSummarize = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(summarize(transcript));
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste a raw transcript and get a structured recap in seconds."
        icon={<FileText className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="transcript">Raw transcript</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={10}
              placeholder="Paste your messy meeting transcript here..."
            />
          </div>
          <Button onClick={handleSummarize} disabled={loading || !transcript.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Summarize Meeting
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardContent className="p-5">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : result ? (
              <div className="space-y-6">
                <Section
                  title="Concise Summary"
                  icon={<AlignLeft className="h-4 w-4" />}
                  accent="bg-primary/10 text-primary"
                >
                  <ul className="ml-1 list-disc space-y-1 pl-4 text-sm">
                    {result.summary.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </Section>

                <Section
                  title="Decisions Made"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  accent="bg-success/15 text-success"
                >
                  <ul className="ml-1 list-disc space-y-1 pl-4 text-sm">
                    {result.decisions.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </Section>

                <Section
                  title="Action Items & Deadlines"
                  icon={<ListChecks className="h-4 w-4" />}
                  accent="bg-warning/15 text-warning"
                >
                  <ul className="space-y-2 text-sm">
                    {result.actions.map((a, i) => (
                      <li
                        key={i}
                        className="rounded-md border bg-muted/30 p-3"
                      >
                        <div>{a.task}</div>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {a.owner && (
                            <span className="rounded bg-accent px-2 py-0.5">Owner: {a.owner}</span>
                          )}
                          {a.due && (
                            <span className="rounded bg-accent px-2 py-0.5">Due: {a.due}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>

                <AiDisclaimer />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your structured summary will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  accent,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`grid h-6 w-6 place-items-center rounded ${accent}`}>{icon}</span>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}
