import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageBubble } from "@/components/ui/MessageBubble";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { trpc } from "@/lib/trpc";
import {
  Brain,
  Send,
  Loader2,
  Plus,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Check,
  Download,
  BookOpen,
  Rocket,
  Bookmark,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { TypingIndicator } from "@/components/TypingIndicator";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations } from "@/lib/celebrations";
import { useLocation, useSearch } from "wouter";
import { designTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function Chats() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [promptProcessed, setPromptProcessed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesError,
    refetch: refetchWorkspaces,
  } = trpc.workspaces.list.useQuery();
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: refetchSessions,
  } = trpc.chat.listSessions.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id },
  );
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const {
    data: sessionData,
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = trpc.chat.getSession.useQuery(
    { sessionId: activeSessionId || 0 },
    { enabled: !!activeSessionId },
  );

  // Combined states
  const isInitialLoading =
    workspacesLoading || (workspaces?.[0]?.id && sessionsLoading);
  const hasError = workspacesError || sessionsError;

  const messages = sessionData?.messages || [];

  const createSessionMutation = trpc.chat.createSession.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const sendFeedbackMutation = trpc.chat.sendFeedback.useMutation();
  const regenerateResponseMutation = trpc.chat.regenerateResponse.useMutation();
  const exportPDFMutation = trpc.export.exportChatPDF.useMutation();
  const saveToLibraryMutation = trpc.contentLibrary.create.useMutation();

  useEffect(() => {
    if (sessions && sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const handleSend = useCallback(
    async (content?: string, sessionIdOverride?: number) => {
      const userMessage = content || message;
      const targetSessionId = sessionIdOverride || activeSessionId;
      if (!userMessage.trim() || isStreaming || !targetSessionId) return;

      const isFirstMessage = messages.length === 0;
      if (!content) setMessage("");
      setIsStreaming(true);
      setStreamingMessage("");

      try {
        // Track message sent
        trackEvent(AnalyticsEvents.MESSAGE_SENT, {
          message_length: userMessage.length,
          session_id: targetSessionId,
        });

        // sendMessage already generates and saves the coach response
        const result = await sendMessageMutation.mutateAsync({
          sessionId: targetSessionId,
          content: userMessage,
        });

        // Simulate typing effect with the response
        if (result.content) {
          const words = result.content.split(" ");
          let accumulated = "";
          for (let i = 0; i < words.length; i++) {
            accumulated += (i === 0 ? "" : " ") + words[i];
            setStreamingMessage(accumulated);
            // Small delay for typing effect (faster for longer responses)
            await new Promise((resolve) =>
              setTimeout(resolve, Math.min(30, 500 / words.length)),
            );
          }
        }

        // Refresh messages to show the saved response
        await refetchMessages();
        setStreamingMessage("");

        // Celebrate first chat if this was the first message
        if (isFirstMessage) {
          celebrations.firstChat();
        }
      } catch (error) {
        handleMutationError(error, ErrorMessages.chatSend);
        setStreamingMessage("");
      } finally {
        setIsStreaming(false);
      }
    },
    [
      message,
      messages,
      isStreaming,
      activeSessionId,
      sendMessageMutation,
      refetchMessages,
    ],
  );

  // Process prompt from URL query parameter (e.g., from onboarding or quick actions)
  const processUrlPrompt = useCallback(async () => {
    const params = new URLSearchParams(searchString);
    const prompt = params.get("prompt");

    if (prompt && !promptProcessed && workspaces?.[0]?.id) {
      setPromptProcessed(true);

      // Create a new chat session if none exists
      let sessionId = activeSessionId;
      if (!sessionId) {
        try {
          const newSession = await createSessionMutation.mutateAsync({
            workspaceId: workspaces[0].id,
            title: `Chat ${new Date().toLocaleDateString("de-DE")}`,
          });
          sessionId = newSession.id;
          setActiveSessionId(sessionId);
          await refetchSessions();
        } catch (error) {
          console.error("Failed to create session for prompt:", error);
          return;
        }
      }

      // Set the message and trigger send
      setMessage(prompt);

      // Clear the URL parameter
      setLocation("/app/chats", { replace: true });

      // Send the message immediately with the sessionId to avoid stale closure
      // We pass sessionId directly to avoid relying on state update timing
      setTimeout(() => handleSend(prompt, sessionId), 0);
    }
  }, [
    searchString,
    promptProcessed,
    workspaces,
    activeSessionId,
    createSessionMutation,
    refetchSessions,
    setLocation,
    handleSend,
  ]);

  useEffect(() => {
    processUrlPrompt();
  }, [processUrlPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleNewChat = async () => {
    try {
      const newSession = await createSessionMutation.mutateAsync({
        workspaceId: workspaces?.[0]?.id || 0,
        title: `Neuer Chat ${new Date().toLocaleDateString("de-DE")}`,
      });

      // Track chat creation
      const isFirstChat = !sessions || sessions.length === 0;
      trackEvent(AnalyticsEvents.CHAT_STARTED, { is_first_chat: isFirstChat });

      setActiveSessionId(newSession.id);
      await refetchSessions();
      toast.success("Neuer Chat erstellt");
    } catch (error) {
      handleMutationError(error, ErrorMessages.chatCreate);
    }
  };

  const handleFeedback = async (
    messageId: number,
    feedback: "positive" | "negative",
  ) => {
    try {
      await sendFeedbackMutation.mutateAsync({ messageId, feedback });

      // Track feedback
      trackEvent(AnalyticsEvents.MESSAGE_FEEDBACK, {
        feedback_type: feedback,
        message_id: messageId,
      });

      toast.success("Feedback gesendet");
    } catch (error) {
      toast.error("Feedback konnte nicht gesendet werden");
    }
  };

  const handleCopy = (content: string, messageId: number) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);

    // Track copy action
    trackEvent(AnalyticsEvents.MESSAGE_COPIED, { message_id: messageId });

    toast.success("In Zwischenablage kopiert");
  };

  const handleSaveToLibrary = async (content: string, messageId: number) => {
    if (!workspaces?.[0]?.id) return;

    try {
      // Extract a title from the first line or use a default
      const firstLine = content.split("\n")[0].substring(0, 50);
      const title =
        firstLine.length < content.length ? firstLine + "..." : firstLine;

      await saveToLibraryMutation.mutateAsync({
        workspaceId: workspaces[0].id,
        title: title || "Gespeicherte Antwort",
        content,
        category: "other",
        sourceChatId: messageId,
      });

      toast.success("In Bibliothek gespeichert");
      trackEvent(AnalyticsEvents.FEATURE_USED, {
        feature: "content_library_save",
        context: `message_${messageId}`,
      });
    } catch (error) {
      toast.error("Konnte nicht speichern");
    }
  };

  const handleRegenerate = async (messageId: number) => {
    try {
      setIsStreaming(true);
      if (!activeSessionId) return;
      await regenerateResponseMutation.mutateAsync({
        sessionId: activeSessionId,
        messageId,
      });

      // Track regeneration
      trackEvent(AnalyticsEvents.MESSAGE_REGENERATED, {
        message_id: messageId,
      });

      await refetchMessages();
      toast.success("Antwort neu generiert");
    } catch (error) {
      handleMutationError(error, ErrorMessages.chatRegenerate);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleExportPDF = async () => {
    if (!activeSessionId) return;
    try {
      const result = await exportPDFMutation.mutateAsync({ limit: 50 });
      const blob = new Blob([Buffer.from(result.data, "base64")], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-${activeSessionId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      // Track PDF export
      trackEvent(AnalyticsEvents.PDF_EXPORTED, { type: "chat" });

      toast.success("PDF exportiert");
    } catch (error) {
      handleMutationError(error, ErrorMessages.pdfExport);
    }
  };

  // Get time-of-day greeting context
  const getTimeContext = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Guten Morgen", period: "morning" };
    if (hour < 17) return { greeting: "Hey", period: "afternoon" };
    return { greeting: "Guten Abend", period: "evening" };
  };
  const timeContext = getTimeContext();

  // Daily-use quick actions (shown in empty state as cards) - focused on 4 key actions
  const quickActions = [
    {
      icon: Sparkles,
      label:
        timeContext.period === "morning" ? "Mein Tag starten" : "Was steht an?",
      prompt:
        timeContext.period === "morning"
          ? "Guten Morgen Houston! Was sollte ich heute als erstes angehen? Gib mir 3 konkrete Aufgaben basierend auf meinen Zielen."
          : "Hey Houston, was sollte ich als nächstes angehen? Zeig mir meine wichtigsten offenen Punkte.",
    },
    {
      icon: MessageSquare,
      label: "Content-Ideen",
      prompt:
        "Ich brauche Content-Ideen! Gib mir 3 konkrete Vorschläge, die zu meiner Zielgruppe passen – mit kurzer Begründung warum.",
    },
    {
      icon: Brain,
      label: "Strategie besprechen",
      prompt:
        "Lass uns über meine Marketing-Strategie sprechen. Was läuft gut? Wo siehst du Verbesserungspotential?",
    },
    {
      icon: Rocket,
      label: "Neues Projekt",
      prompt:
        "Ich möchte etwas Neues starten! Welche Marketing-Projekte würdest du mir empfehlen – und warum?",
    },
  ];

  // Quick chips (shown below input when there are messages) - conversational continuations
  const quickChips = [
    { label: "Mehr Details", prompt: "Kannst du das genauer erklären?" },
    {
      label: "Konkrete Schritte",
      prompt: "Was sind die konkreten nächsten Schritte dafür?",
    },
    { label: "Alternative?", prompt: "Gibt es noch andere Möglichkeiten?" },
    {
      label: "Beispiel zeigen",
      prompt: "Kannst du mir ein konkretes Beispiel geben?",
    },
  ];

  // Show loading state
  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade deine Chats..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="Chats konnten nicht geladen werden"
            message="Es gab ein Problem beim Laden deiner Chat-Sessions. Bitte versuche es erneut."
            onRetry={() => {
              refetchWorkspaces();
              refetchSessions();
            }}
            fullPage
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header with Session Selector */}
        <div className="border-b border-border/50 dark:border-white/10 bg-background/95 dark:bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
          <div className="chat-header container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="chat-header-title flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[var(--accent-tertiary)]" />
                <h1 className="text-lg font-semibold">Houston</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                Dein Marketing-Genius
              </Badge>
            </div>

            <div className="chat-header-actions flex items-center gap-2 flex-shrink-0">
              {sessions && sessions.length > 0 && (
                <Select
                  value={activeSessionId?.toString()}
                  onValueChange={(val) => setActiveSessionId(parseInt(val))}
                >
                  <SelectTrigger className="w-[200px] hidden md:flex">
                    <SelectValue placeholder="Chat auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem
                        key={session.id}
                        value={session.id.toString()}
                      >
                        {session.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline" size="sm" onClick={handleNewChat}>
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Neuer Chat</span>
              </Button>

              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleExportPDF}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages - Centered */}
        <ScrollArea ref={scrollRef} className="flex-1">
          <div className="container max-w-3xl mx-auto px-4 py-8">
            {messages.length === 0 && !streamingMessage && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] mb-4 shadow-lg shadow-[#FF6B9D]/20 animate-in zoom-in duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{
                      animationDelay: designTokens.animation.delay.stagger2,
                    }}
                  >
                    Hey! 👋 Womit kann ich helfen?
                  </h2>
                  <p
                    className="text-muted-foreground max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{
                      animationDelay: designTokens.animation.delay.stagger4,
                    }}
                  >
                    Ich bin Houston, dein Marketing-Genius. Frag mich nach
                    Strategien, Content-Ideen oder lass uns deine nächste
                    Kampagne planen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickActions.map((action, idx) => {
                    const delays = [
                      designTokens.animation.delay.stagger1,
                      designTokens.animation.delay.stagger2,
                      designTokens.animation.delay.stagger3,
                      designTokens.animation.delay.stagger4,
                    ];
                    return (
                      <ConversationCard
                        key={idx}
                        title={action.label}
                        icon={<action.icon className="w-5 h-5" />}
                        action={{
                          label: "Verwenden",
                          onClick: () => setMessage(action.prompt),
                          variant: "outline",
                        }}
                        gradient="pink-purple"
                        className="animate-in fade-in slide-in-from-bottom-2 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                        style={{
                          animationDelay:
                            delays[idx] || delays[delays.length - 1],
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((msg: any, index: number) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role === "user" ? "user" : "coach"}
                    content={msg.content}
                    userName={user?.name}
                    messageId={msg.id}
                    onCopy={(content) => handleCopy(content, msg.id)}
                    onRegenerate={handleRegenerate}
                    onSave={handleSaveToLibrary}
                    onFeedback={handleFeedback}
                    copied={copiedMessageId === msg.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
                  />
                ))}

                {isStreaming && !streamingMessage && (
                  <div className="flex gap-3 items-start">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="text-xs font-medium text-muted-foreground">
                        Houston
                      </div>
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                {streamingMessage && (
                  <MessageBubble
                    role="coach"
                    content={streamingMessage}
                    showActions={false}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  />
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area - Centered */}
        <div className="border-t border-border/50 dark:border-white/10 bg-background/95 dark:bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
          <div className="container max-w-3xl mx-auto px-4 py-4 space-y-3">
            {/* Quick Chips - Show when there are messages */}
            {messages.length > 0 && !isStreaming && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(chip.prompt)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/50 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all duration-150 text-muted-foreground dark:text-muted-foreground active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Stelle Houston eine Frage zum Marketing..."
                disabled={isStreaming || !activeSessionId}
                className={cn(
                  "flex-1 bg-background dark:bg-background border-border/50 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/30",
                  "ai-gradient-input",
                  isStreaming && "ai-working",
                )}
              />
              <Button
                onClick={() => handleSend()}
                disabled={isStreaming || !message.trim() || !activeSessionId}
                variant="gradient"
                className={cn(
                  "transition-all duration-200 hover:scale-105 active:scale-95 relative",
                  isStreaming && "ai-working ai-gradient-glow",
                )}
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
