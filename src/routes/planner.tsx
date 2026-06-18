import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — TaskMind" },
      {
        name: "description",
        content: "Turn an unstructured task list into a prioritized weekly plan.",
      },
    ],
  }),
  component: PlannerPage,
});

type Priority = "Urgent" | "High" | "Medium" | "Low";
type Task = { title: string; priority: Priority };
type DayPlan = { day: string; tasks: Task[] };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function classify(line: string): Priority {
  const l = line.toLowerCase();
  if (/(urgent|asap|today|critical|blocker|deadline today)/.test(l)) return "Urgent";
  if (/(important|priority|tomorrow|client|launch|presentation|demo)/.test(l)) return "High";
  if (/(later|optional|nice to have|backlog|whenever)/.test(l)) return "Low";
  return "Medium";
}

function plan(raw: string): DayPlan[] {
  const tasks: Task[] = raw
    .split("\n")
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean)
    .map((title) => ({ title, priority: classify(title) }));

  const order: Priority[] = ["Urgent", "High", "Medium", "Low"];
  tasks.sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));

  const days: DayPlan[] = DAYS.map((d) => ({ day: d, tasks: [] }));
  tasks.forEach((t, i) => {
    days[i % DAYS.length].tasks.push(t);
  });
  return days;
}

const priorityStyles: Record<Priority, string> = {
  Urgent: "bg-danger/15 text-danger border-danger/30",
  High: "bg-warning/15 text-warning border-warning/30",
  Medium: "bg-primary/10 text-primary border-primary/30",
  Low: "bg-muted text-muted-foreground border-border",
};

function PlannerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<DayPlan[] | null>(null);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setSchedule(plan(input));
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader
        title="AI Task Planner"
        description="Drop your week's tasks — get a structured, prioritized daily plan."
        icon={<CalendarClock className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks for the week</Label>
            <Textarea
              id="tasks"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              placeholder={"- Finish urgent client proposal\n- Review Q3 metrics\n- Optional: clean up Notion docs\n- Prepare Friday demo"}
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Schedule
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
            ) : schedule ? (
              <>
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                  {(["Urgent", "High", "Medium", "Low"] as Priority[]).map((p) => (
                    <span
                      key={p}
                      className={`rounded-full border px-2 py-0.5 ${priorityStyles[p]}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {schedule.map((d) => (
                    <div
                      key={d.day}
                      className="rounded-lg border bg-card p-3"
                    >
                      <div className="mb-2 text-sm font-semibold">{d.day}</div>
                      <div className="space-y-2">
                        {d.tasks.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Free</p>
                        ) : (
                          d.tasks.map((t, i) => (
                            <div
                              key={i}
                              className="rounded-md border bg-background p-2 text-sm"
                            >
                              <div className="break-words">{t.title}</div>
                              <span
                                className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${priorityStyles[t.priority]}`}
                              >
                                {t.priority}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <AiDisclaimer />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your generated weekly schedule will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
