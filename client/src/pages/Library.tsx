import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { BookOpen, Search, Trash2, Copy, Check, Tag } from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: workspaces, isLoading: workspacesLoading } =
    trpc.workspaces.list.useQuery();
  const {
    data: libraryItems,
    isLoading: libraryLoading,
    refetch,
  } = trpc.contentLibrary.list.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id },
  );

  const deleteMutation = trpc.contentLibrary.delete.useMutation();

  const isLoading =
    workspacesLoading || (workspaces?.[0]?.id && libraryLoading);
  const workspaceId = workspaces?.[0]?.id;

  const filteredItems =
    libraryItems?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const handleCopy = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Kopiert!");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Wirklich löschen?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      await refetch();
      toast.success("Gelöscht");
    } catch (error) {
      toast.error("Fehler beim Löschen");
    }
  };

  const categoryLabels: Record<string, string> = {
    hook: "Hook",
    post: "Post",
    email: "E-Mail",
    ad: "Werbung",
    other: "Sonstiges",
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade Bibliothek..." fullPage />
      </DashboardLayout>
    );
  }

  if (!workspaceId) {
    return (
      <DashboardLayout>
        <ErrorState
          title="Kein Workspace gefunden"
          message="Bitte erstelle zuerst einen Workspace."
          fullPage
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-[var(--color-gradient-purple)]" />
              Content-Bibliothek
            </h1>
            <p className="text-muted-foreground">
              Gespeicherte Antworten, Hooks und wiederverwendbare Inhalte
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="In Bibliothek suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Library Items */}
        {filteredItems.length === 0 ? (
          <Card className="glass border-white/10">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-pink)] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-pink)]">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {searchQuery
                  ? "Nichts gefunden"
                  : "Noch keine Inhalte gespeichert"}
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery
                  ? "Versuche einen anderen Suchbegriff."
                  : "Speichere interessante Antworten aus dem Chat, um sie später wiederzuverwenden."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item: any) => (
              <Card
                key={item.id}
                className="hover:border-[var(--color-gradient-purple)]/30 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.title}
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[item.category] || item.category}
                        </Badge>
                      </CardTitle>
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {JSON.parse(item.tags || "[]").map(
                            (tag: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(item.content, item.id)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Gespeichert am{" "}
                    {new Date(item.createdAt).toLocaleDateString("de-DE")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
