import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, Target, CheckSquare, Rocket } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

interface TableViewProps {
  items: any[];
  type: "goals" | "tasks";
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
}

export default function TableView({ items, type, onEdit, onDelete }: TableViewProps) {
  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "created") {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      completed: "secondary",
      paused: "outline",
      todo: "outline",
      in_progress: "default",
      done: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (type === "goals") {
    return (
      <div className="rounded-lg border border-base-20 bg-base-0/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                <div className="flex items-center gap-2">
                  Titel
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Beschreibung</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Fortschritt</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("created")}>
                <div className="flex items-center gap-2">
                  Erstellt
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B9D]/10 to-[#C44FE2]/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-[#FF6B9D]" />
                    </div>
                    <div>
                      <p className="font-medium">Noch keine Ziele definiert</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Erstelle dein erstes Ziel oder besprich mit Houston, was du erreichen möchtest.
                      </p>
                    </div>
                    <Link href="/app/chats?prompt=Hilf mir, mein erstes Marketing-Ziel zu definieren">
                      <Button variant="outline" size="sm" className="mt-2 gap-2">
                        <Rocket className="h-4 w-4" />
                        Mit Houston planen
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{goal.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{goal.description}</TableCell>
                  <TableCell>{getStatusBadge(goal.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress || 0} className="w-20" />
                      <span className="text-sm text-muted-foreground">{goal.progress || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(goal.createdAt).toLocaleDateString("de-DE")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(goal)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(goal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Tasks table
  return (
    <div className="rounded-lg border border-base-20 bg-base-0/50 backdrop-blur-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
              <div className="flex items-center gap-2">
                Titel
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center gap-2">
                Status
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
              <div className="flex items-center gap-2">
                Priorität
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Fällig am</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B9D]/10 to-[#C44FE2]/10 flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-[#FF6B9D]" />
                  </div>
                  <div>
                    <p className="font-medium">Alles erledigt! 🎉</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Keine offenen Aufgaben. Frag Houston nach neuen Ideen!
                    </p>
                  </div>
                  <Link href="/app/chats?prompt=Was sollte ich als nächstes für mein Marketing tun?">
                    <Button variant="outline" size="sm" className="mt-2 gap-2">
                      <Rocket className="h-4 w-4" />
                      Houston fragen
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedItems.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getStatusBadge(task.priority)}</TableCell>
                <TableCell>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString("de-DE") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
