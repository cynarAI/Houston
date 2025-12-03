import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

export function TransactionHistoryTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = trpc.credits.getTransactionHistory.useQuery({
    page,
    pageSize,
  });

  // Helper function to format feature keys to German
  const formatFeatureName = (featureKey: string) => {
    const featureNames: Record<string, string> = {
      CHAT_MESSAGE: "Chat-Nachricht",
      DEEP_ANALYSIS: "Deep Analysis",
      AI_INSIGHTS: "KI-Insights",
      PDF_EXPORT: "PDF-Export",
      GOALS_GENERATION: "Ziele-Generierung",
      STRATEGY_ANALYSIS: "Strategie-Analyse",
      CREDIT_PURCHASE: "Credit-Kauf",
      REFERRAL_BONUS: "Empfehlungsbonus",
      SIGNUP_BONUS: "Registrierungsbonus",
    };
    return featureNames[featureKey] || featureKey.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaktionsverlauf</CardTitle>
          <CardDescription>Detailliertes Credit-Protokoll</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaktionsverlauf</CardTitle>
          <CardDescription>Detailliertes Credit-Protokoll</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">Transaktionen konnten nicht geladen werden</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaktionsverlauf</CardTitle>
          <CardDescription>Detailliertes Credit-Protokoll</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Noch keine Transaktionen</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaktionsverlauf</CardTitle>
        <CardDescription>
          Zeige {data.transactions.length} von {data.total} Transaktionen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead className="text-right">Credits</TableHead>
                <TableHead className="text-right">Saldo danach</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.createdAt).toLocaleDateString("de-DE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatFeatureName(transaction.featureKey)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={transaction.creditsSpent < 0 ? "destructive" : "default"}
                      className={
                        transaction.creditsSpent < 0
                          ? ""
                          : "bg-green-500 hover:bg-green-600"
                      }
                    >
                      {transaction.creditsSpent > 0 ? "+" : ""}
                      {transaction.creditsSpent}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {transaction.balanceAfter}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Seite {data.page} von {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Zurück
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                Weiter
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
