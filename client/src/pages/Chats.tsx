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
import { Brain, Send, Loader2, Plus, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Copy, RotateCcw, Check, Download } from "lucide-react";
import { Streamdown } from "streamdown";
import { TypingIndicator } from "@/components/TypingIndicator";
import { toast } from "sonner";

export default function Chats() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const { data: sessions, refetch: refetchSessions } = trpc.chat.listSessions.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id }
  );
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const { data: sessionData, refetch: refetchMessages } = trpc.chat.getSession.useQuery(
    { sessionId: activeSessionId || 0 },
    { enabled: !!activeSessionId }
  );

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
        title: `New Chat ${new Date().toLocaleDateString("en-US")}`,
      });
      setActiveSessionId(newSession.id);
      await refetchSessions();
      toast.success("New chat created");
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isStreaming || !activeSessionId) return;

    const userMessage = message;
    setMessage("");
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      await sendMessageMutation.mutateAsync({
        sessionId: activeSessionId,
        content: userMessage,
      });

      await refetchMessages();

      const response = await fetch("/api/trpc/chat.streamResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          userMessage,
        }),
      });

      if (!response.ok || !response.body) throw new Error("Stream failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                accumulatedText += data.content;
                setStreamingMessage(accumulatedText);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      await refetchMessages();
      setStreamingMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      setStreamingMessage("");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFeedback = async (messageId: number, feedback: "positive" | "negative") => {
    try {
      await sendFeedbackMutation.mutateAsync({ messageId, feedback });
      toast.success("Feedback sent");
    } catch (error) {
      toast.error("Failed to send feedback");
    }
  };

  const handleCopy = (content: string, messageId: number) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const handleRegenerate = async (messageId: number) => {
    try {
      setIsStreaming(true);
      if (!activeSessionId) return;
      await regenerateResponseMutation.mutateAsync({ sessionId: activeSessionId, messageId });
      await refetchMessages();
      toast.success("Response regenerated");
    } catch (error) {
      toast.error("Failed to regenerate response");
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
      toast.success("PDF exported");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const quickActions = [
    { icon: MessageSquare, label: "Marketing Strategy", prompt: "Help me create a marketing strategy" },
    { icon: Sparkles, label: "Content Ideas", prompt: "Give me content ideas for social media" },
  ];

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
                AI Marketing Assistant
              </Badge>
            </div>
            
            <div className="chat-header-actions flex items-center gap-2 flex-shrink-0">
              {sessions && sessions.length > 0 && (
                <Select value={activeSessionId?.toString()} onValueChange={(val) => setActiveSessionId(parseInt(val))}>
                  <SelectTrigger className="w-[200px] hidden md:flex">
                    <SelectValue placeholder="Select chat" />
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
                <span className="hidden md:inline">New Chat</span>
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">What can I help you with?</h2>
                  <p className="text-muted-foreground max-w-md">
                    I'm your AI marketing assistant. Ask me anything about marketing strategy, content creation, or campaign optimization.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(action.prompt)}
                      className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-accent/50 transition-all text-left group"
                    >
                      <action.icon className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
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
                        {msg.role === "user" ? "You" : "Houston"}
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
                      
                      {msg.role === "assistant" && (
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

                {isStreaming && !streamingMessage && (
                  <div className="flex gap-3 items-start">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-card border-border">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
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
                placeholder="Ask Houston anything about marketing..."
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
