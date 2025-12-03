import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Brain, Send, Loader2, Plus, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Copy, RotateCcw, Check, Download, BookOpen, Rocket } from "lucide-react";
import { Streamdown } from "streamdown";
import { TypingIndicator } from "@/components/TypingIndicator";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations } from "@/lib/celebrations";

export default function Chats() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: workspaces, isLoading: workspacesLoading, isError: workspacesError, refetch: refetchWorkspaces } = trpc.workspaces.list.useQuery();
  const { data: sessions, isLoading: sessionsLoading, isError: sessionsError, refetch: refetchSessions } = trpc.chat.listSessions.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id }
  );
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const { data: sessionData, isLoading: messagesLoading, isError: messagesError, refetch: refetchMessages } = trpc.chat.getSession.useQuery(
    { sessionId: activeSessionId || 0 },
    { enabled: !!activeSessionId }
  );
  
  // Combined states
  const isInitialLoading = workspacesLoading || (workspaces?.[0]?.id && sessionsLoading);
  const hasError = workspacesError || sessionsError;

  const messages = sessionData?.messages || [];

  const createSessionMutation = trpc.chat.createSession.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const sendFeedbackMutation = trpc.chat.sendFeedback.useMutation();
  const regenerateResponseMutation = trpc.chat.regenerateResponse.useMutation();
  const exportPDFMutation = trpc.export.exportChatPDF.useMutation();


  useEffect(() => {
    if (sessions && sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

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

  const handleSend = async () => {
    if (!message.trim() || isStreaming || !activeSessionId) return;

    const userMessage = message;
    const isFirstMessage = messages.length === 0;
    setMessage("");
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      // Track message sent
      trackEvent(AnalyticsEvents.MESSAGE_SENT, { message_length: userMessage.length, session_id: activeSessionId });
      
      // sendMessage already generates and saves the coach response
      const result = await sendMessageMutation.mutateAsync({
        sessionId: activeSessionId,
        content: userMessage,
      });

      // Simulate typing effect with the response
      if (result.content) {
        const words = result.content.split(' ');
        let accumulated = '';
        for (let i = 0; i < words.length; i++) {
          accumulated += (i === 0 ? '' : ' ') + words[i];
          setStreamingMessage(accumulated);
          // Small delay for typing effect (faster for longer responses)
          await new Promise(resolve => setTimeout(resolve, Math.min(30, 500 / words.length)));
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
  };

  const handleFeedback = async (messageId: number, feedback: "positive" | "negative") => {
    try {
      await sendFeedbackMutation.mutateAsync({ messageId, feedback });
      
      // Track feedback
      trackEvent(AnalyticsEvents.MESSAGE_FEEDBACK, { feedback_type: feedback, message_id: messageId });
      
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

  const handleRegenerate = async (messageId: number) => {
    try {
      setIsStreaming(true);
      if (!activeSessionId) return;
      await regenerateResponseMutation.mutateAsync({ sessionId: activeSessionId, messageId });
      
      // Track regeneration
      trackEvent(AnalyticsEvents.MESSAGE_REGENERATED, { message_id: messageId });
      
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
      const blob = new Blob([Buffer.from(result.data, "base64")], { type: "application/pdf" });
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

  const quickActions = [
    { icon: BookOpen, label: "Welches Playbook passt zu mir?", prompt: "Welches Marketing-Playbook würdest du mir empfehlen? Analysiere meine Situation und schlage das passendste vor." },
    { icon: Rocket, label: "Lead-Magnet erstellen", prompt: "Hilf mir, einen Lead-Magneten zu erstellen. Welche Ideen hast du für meine Branche?" },
    { icon: MessageSquare, label: "Newsletter-Strategie", prompt: "Ich möchte eine E-Mail-Newsletter-Serie aufbauen. Wie sollte ich vorgehen?" },
    { icon: Sparkles, label: "Content-Ideen generieren", prompt: "Gib mir 10 Content-Ideen für Social Media basierend auf meinem Business" },
    { icon: Brain, label: "Zielgruppen-Analyse", prompt: "Analysiere meine Zielgruppe und erstelle detaillierte Personas mit Pain Points und Bedürfnissen" },
    { icon: Send, label: "Launch-Kampagne planen", prompt: "Ich plane einen Produkt-Launch. Welche Schritte empfiehlst du für eine erfolgreiche Launch-Kampagne?" },
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
        <div className="border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
          <div className="chat-header container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="chat-header-title flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[var(--accent-tertiary)]" />
                <h1 className="text-lg font-semibold">Houston</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                KI Marketing-Assistent
              </Badge>
            </div>
            
            <div className="chat-header-actions flex items-center gap-2 flex-shrink-0">
              {sessions && sessions.length > 0 && (
                <Select value={activeSessionId?.toString()} onValueChange={(val) => setActiveSessionId(parseInt(val))}>
                  <SelectTrigger className="w-[200px] hidden md:flex">
                    <SelectValue placeholder="Chat auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id.toString()}>
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
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">Womit kann ich dir helfen?</h2>
                  <p className="text-muted-foreground max-w-md">
                    Ich bin dein KI Marketing-Assistent. Frag mich alles zu Marketing-Strategien, Content-Erstellung oder Kampagnen-Optimierung.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(action.prompt)}
                      className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-accent/50 transition-all text-left group"
                    >
                      <action.icon className="w-5 h-5 text-[var(--color-gradient-pink)] shrink-0" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="flex gap-3 items-start">
                    {/* Avatar - Always show */}
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className={msg.role === "user" 
                        ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-medium" 
                        : "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white"
                      }>
                        {msg.role === "user" ? user?.name?.charAt(0).toUpperCase() : <Brain className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="text-xs font-medium text-muted-foreground">
                        {msg.role === "user" ? "Du" : "Houston"}
                      </div>
                      
                      <Card className={`p-4 ${
                        msg.role === "user" 
                          ? "bg-blue-500/10 border-blue-500/20 text-foreground" 
                          : "bg-card border-border"
                      }`}>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <Streamdown>{msg.content}</Streamdown>
                        </div>
                      </Card>
                      
                      {msg.role === "coach" && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => handleFeedback(msg.id, "positive")}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => handleFeedback(msg.id, "negative")}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => handleCopy(msg.content, msg.id)}
                          >
                            {copiedMessageId === msg.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => handleRegenerate(msg.id)}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isStreaming && !streamingMessage && (
                  <div className="flex gap-3 items-start">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="text-xs font-medium text-muted-foreground">Houston</div>
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                {streamingMessage && (
                  <div className="flex gap-3 items-start">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="text-xs font-medium text-muted-foreground">Houston</div>
                      <Card className="p-4 bg-card border-border">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <Streamdown>{streamingMessage}</Streamdown>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area - Centered */}
        <div className="border-t border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
          <div className="container max-w-3xl mx-auto px-4 py-4">
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
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isStreaming || !message.trim() || !activeSessionId}>
                {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
