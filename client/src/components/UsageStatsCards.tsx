import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Target, MessageSquare, LayoutGrid } from "lucide-react";
import { CircularProgress } from "./CircularProgress"; // Assuming we have this component, if not I'll create it
import { cn } from "@/lib/utils";

// If CircularProgress doesn't exist yet, I'll define a simple version here
function SimpleCircularProgress({
  value,
  max,
  size = 60,
  color = "text-primary",
}: {
  value: number;
  max: number;
  size?: number;
  color?: string;
}) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          className="text-muted/20"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="30"
          cy="30"
        />
        {/* Progress Circle */}
        <circle
          className={cn("transition-all duration-1000 ease-out", color)}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="30"
          cy="30"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
        {value}/{max}
      </div>
    </div>
  );
}

export function UsageStatsCards() {
  const { data: creditStats } = trpc.credits.getUsageStats.useQuery();
  const { data: workspaceStats } = trpc.workspaces.getUsageStats.useQuery();

  // Mock data for limits until fully implemented in backend
  const stats = {
    workspaces: {
      used: workspaceStats?.workspacesUsed ?? 1,
      limit: workspaceStats?.workspacesLimit ?? 1,
    },
    chats: { used: 12, limit: 20 }, // Mock for now
    goals: { used: 2, limit: 3 }, // Mock for now
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Workspaces Card */}
      <Card className="glass border-white/5 bg-black/20 hover:bg-black/40 transition-colors group overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-blue-400 transition-colors">
            Workspaces
          </CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {stats.workspaces.used}
              </div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </div>
            <SimpleCircularProgress
              value={stats.workspaces.used}
              max={stats.workspaces.limit}
              color="text-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals Card */}
      <Card className="glass border-white/5 bg-black/20 hover:bg-black/40 transition-colors group overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-purple-400 transition-colors">
            Active Goals
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {stats.goals.used}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </div>
            <SimpleCircularProgress
              value={stats.goals.used}
              max={stats.goals.limit}
              color="text-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chats Card */}
      <Card className="glass border-white/5 bg-black/20 hover:bg-black/40 transition-colors group overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors" />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-pink-400 transition-colors">
            Monthly Chats
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-pink-400 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {stats.chats.used}
              </div>
              <p className="text-xs text-muted-foreground">Messages sent</p>
            </div>
            <SimpleCircularProgress
              value={stats.chats.used}
              max={stats.chats.limit}
              color="text-pink-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
