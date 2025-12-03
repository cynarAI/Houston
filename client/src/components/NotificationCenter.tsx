import { useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { NotificationList } from "./NotificationList";
import { Badge } from "./ui/badge";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  // Get unread count
  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Poll every 30 seconds
    }
  );

  // Get all notifications when dropdown opens
  const { data: notifications, isLoading } = trpc.notifications.getAll.useQuery(
    { limit: 50 },
    {
      enabled: open,
    }
  );

  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getUnreadCount.invalidate();
      utils.notifications.getAll.invalidate();
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  // Accessible label with unread count
  const buttonAriaLabel = useMemo(() => {
    if (!unreadCount || unreadCount === 0) {
      return "Benachrichtigungen - keine ungelesenen";
    }
    if (unreadCount === 1) {
      return "Benachrichtigungen - 1 ungelesen";
    }
    return `Benachrichtigungen - ${unreadCount} ungelesen`;
  }, [unreadCount]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg"
          aria-label={buttonAriaLabel}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount && unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#ffb606] text-black border-0"
              variant="default"
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0"
        sideOffset={8}
        aria-label="Benachrichtigungen"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold" id="notifications-heading">Benachrichtigungen</h3>
          {unreadCount && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="h-8 text-xs"
              aria-label="Alle als gelesen markieren"
            >
              Alle gelesen
            </Button>
          )}
        </div>
        <NotificationList
          notifications={notifications || []}
          isLoading={isLoading}
          onClose={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
