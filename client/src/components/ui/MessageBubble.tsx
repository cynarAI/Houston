import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Copy,
  RotateCcw,
  Bookmark,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { useState } from "react";

export interface MessageBubbleProps {
  role: "user" | "coach";
  content: string;
  userName?: string;
  messageId?: number;
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: number) => void;
  onSave?: (content: string, messageId: number) => void;
  onFeedback?: (messageId: number, feedback: "positive" | "negative") => void;
  copied?: boolean;
  className?: string;
  showActions?: boolean;
}

export function MessageBubble({
  role,
  content,
  userName,
  messageId,
  onCopy,
  onRegenerate,
  onSave,
  onFeedback,
  copied = false,
  className,
  showActions = true,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 items-start group animate-in fade-in slide-in-from-bottom-2 duration-300",
        className,
      )}
    >
      {/* Avatar */}
      <Avatar className="w-9 h-9 shrink-0 ring-2 ring-background shadow-md">
        <AvatarFallback
          className={
            isUser
              ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-medium"
              : "bg-gradient-to-br from-[var(--aistronaut-pink)] to-[var(--aistronaut-purple)] text-white"
          }
        >
          {isUser ? (
            userName?.charAt(0).toUpperCase() || "U"
          ) : (
            <Brain className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Role Label */}
        <div className="text-xs font-medium text-muted-foreground">
          {isUser ? userName || "Du" : "Houston"}
        </div>

        {/* Message Card */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 transition-all duration-200",
            isUser
              ? "bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-foreground"
              : "bg-card dark:bg-card/80 border border-border dark:border-border/80 hover:border-border dark:hover:border-border shadow-sm",
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Streamdown>{content}</Streamdown>
          </div>
        </div>

        {/* Action Buttons - Only for coach messages */}
        {!isUser && showActions && messageId && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onFeedback && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 hover:bg-green-500/10 hover:text-green-500 dark:hover:bg-green-500/20"
                  onClick={() => onFeedback(messageId, "positive")}
                  aria-label="Positive feedback"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20"
                  onClick={() => onFeedback(messageId, "negative")}
                  aria-label="Negative feedback"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
            {onCopy && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onCopy(content)}
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onRegenerate(messageId)}
                aria-label="Regenerate response"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 hover:bg-blue-500/10 hover:text-blue-500 dark:hover:bg-blue-500/20"
                onClick={() => onSave(content, messageId)}
                aria-label="Save to library"
              >
                <Bookmark className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
