import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { 
  AlertCircle, 
  CheckCircle, 
  Gift, 
  Target, 
  Info,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface NotificationItemProps {
  notification: any;
  onClose: () => void;
}

const notificationIcons = {
  credit_warning: AlertCircle,
  purchase_success: CheckCircle,
  referral_reward: Gift,
  goal_reminder: Target,
  system_message: Info,
};

const notificationColors = {
  credit_warning: "text-orange-500",
  purchase_success: "text-green-500",
  referral_reward: "text-purple-500",
  goal_reminder: "text-blue-500",
  system_message: "text-cyan-500",
};

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { i18n } = useTranslation();
  const utils = trpc.useUtils();

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getUnreadCount.invalidate();
      utils.notifications.getAll.invalidate();
    },
  });

  const deleteNotification = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.getUnreadCount.invalidate();
      utils.notifications.getAll.invalidate();
      toast.success("Notification deleted");
    },
  });

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead.mutate({ notificationId: notification.id });
    }
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate({ notificationId: notification.id });
  };

  const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;
  const iconColor = notificationColors[notification.type as keyof typeof notificationColors] || "text-muted-foreground";

  const locale = i18n.language === 'de' ? de : enUS;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale,
  });

  return (
    <div
      className={`flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer relative group ${
        !notification.isRead ? "bg-accent/20" : ""
      }`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-1">
            {notification.title}
          </h4>
          {!notification.isRead && (
            <div className="flex-shrink-0 w-2 h-2 bg-[#ffb606] rounded-full mt-1" />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
        onClick={handleDelete}
        disabled={deleteNotification.isPending}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
