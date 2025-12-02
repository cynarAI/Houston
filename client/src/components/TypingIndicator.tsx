export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 w-fit">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] typing-dot"></div>
      </div>
      <span className="text-sm text-muted-foreground">Houston is thinking...</span>
    </div>
  );
}
