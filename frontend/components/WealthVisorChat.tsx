"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Bot, User, X, MessageSquare } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function WealthVisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      sessionIdRef.current = data.session_id;

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-purple hover:bg-purple/90 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-all duration-200 flex items-center gap-2 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
          Ask WealthVisor
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-black border border-purple/30 rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple to-purple/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-white/20 rounded-lg w-10 h-10">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-black text-white text-sm">WealthVisor</div>
            <div className="text-white/80 text-xs">
              {isSending ? "Thinking..." : "Your AI Financial Advisor"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-black to-gray-900"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <Bot className="w-16 h-16 text-purple mb-4" />
            <p className="text-gray-400 text-sm mb-2">
              Hi! I'm WealthVisor, your AI financial advisor.
            </p>
            <p className="text-gray-500 text-xs">
              Ask me about markets, investments, or financial planning!
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="flex justify-center items-center bg-purple/20 rounded-lg w-8 h-8 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-purple" />
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] text-sm leading-relaxed ${
                  m.role === "assistant"
                    ? "bg-white/5 text-gray-200 border border-white/10"
                    : "bg-purple text-white"
                }`}
              >
                <div
                  className="whitespace-pre-wrap [&_strong]:font-bold [&_strong]:text-white"
                  dangerouslySetInnerHTML={{
                    __html: m.content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
              {m.role === "user" && (
                <div className="flex justify-center items-center bg-purple/20 rounded-lg w-8 h-8 flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-purple" />
                </div>
              )}
            </div>
          ))
        )}
        {isSending && (
          <div className="flex gap-3 justify-start">
            <div className="flex justify-center items-center bg-purple/20 rounded-lg w-8 h-8 flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-purple" />
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-black/80 border-t border-white/10">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about stocks, investments, or financial advice..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-purple transition-colors"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={isSending || input.trim().length === 0}
            className="bg-purple hover:bg-purple/80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2 h-[60px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          💡 Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
