import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — TaskMind" },
      {
        name: "description",
        content: "Turn quick bullet points into polished, audience-aware emails.",
      },
    ],
  }),
  component: EmailGenerator,
});

type Audience = "Client" | "Manager" | "Team";
type Tone = "Formal" | "Informal" | "Persuasive";

function buildEmail(bullets: string, audience: Audience, tone: Tone) {
  const points = bullets
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  const greetings: Record<Audience, string> = {
    Client: "Dear Valued Client,",
    Manager: "Hi [Manager's Name],",
    Team: "Hey team,",
  };
  const openings: Record<Tone, string> = {
    Formal: "I hope this message finds you well. I am writing to share the following updates:",
    Informal: "Hope you're doing great! Quick note on a few things:",
    Persuasive:
      "I wanted to bring something important to your attention that I believe will make a meaningful difference:",
  };
  const closings: Record<Tone, string> = {
    Formal: "Please let me know if you would like to discuss any of the above in more detail.",
    Informal: "Let me know what you think whenever you get a sec.",
    Persuasive:
      "I'd love to align on next steps soon — even fifteen minutes this week would go a long way.",
  };
  const signoffs: Record<Tone, string> = {
    Formal: "Kind regards,",
    Informal: "Cheers,",
    Persuasive: "Looking forward,",
  };

  const body =
    points.length > 0
      ? points.map((p) => `• ${p.charAt(0).toUpperCase() + p.slice(1)}`).join("\n")
      : "• [Add your key points above to generate a tailored email.]";

  return `Subject: Quick update${audience === "Client" ? " for your review" : ""}

${greetings[audience]}

${openings[tone]}

${body}

${closings[tone]}

${signoffs[tone]}
[Your Name]`;
}

function EmailGenerator() {
  const [bullets, setBullets] = useState("");
  const [audience, setAudience] = useState<Audience>("Client");
  const [tone, setTone] = useState<Tone>("Formal");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setOutput(buildEmail(bullets, audience, tone));
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader
        title="Smart Email Generator"
        description="Turn rough bullet points into polished, audience-aware emails."
        icon={<Mail className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="space-y-2">
              <Label htmlFor="bullets">Key points</Label>
              <Textarea
                id="bullets"
                placeholder={"- Project is on track\n- Need approval on budget\n- Demo on Friday"}
                value={bullets}
                onChange={(e) => setBullets(e.target.value)}
                rows={8}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <RadioGroup
                  value={tone}
                  onValueChange={(v) => setTone(v as Tone)}
                  className="flex flex-wrap gap-3 pt-1"
                >
                  {(["Formal", "Informal", "Persuasive"] as Tone[]).map((t) => (
                    <label
                      key={t}
                      className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                    >
                      <RadioGroupItem value={t} />
                      {t}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-5">
            <Label htmlFor="output">Generated email</Label>
            {loading ? (
              <div className="flex h-72 items-center justify-center rounded-md border bg-muted/30">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <Textarea
                id="output"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Your AI-generated email will appear here. You can edit it freely."
                rows={16}
                className="font-mono text-sm"
              />
            )}
            <AiDisclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
