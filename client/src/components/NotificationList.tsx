import { ScrollArea } from "./ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { Loader2 } from "lucide-react";

interface NotificationListProps {
  notifications: any[];
  isLoading: boolean;
  onClose: () => void;
}

export function NotificationList({
  notifications,
  isLoading,
  onClose,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">
            No notifications yet
          </p>
          <p className="text-xs text-muted-foreground">
            We'll notify you when something important happens
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={onClose}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
