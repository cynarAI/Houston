import { ScrollArea } from "./ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            {t("notifications.empty")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("notifications.emptyHint")}
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
