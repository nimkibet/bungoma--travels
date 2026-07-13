"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Jambo! Welcome to Bungoma Tours. How can I help you plan your adventure today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(1) // exclude the initial hardcoded system prompt if we had one in state
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-terracotta-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-terracotta-700 hover:scale-110 transition-all z-50 animate-bounce group"
        >
          <MessageCircle className="w-7 h-7 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-savanna-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-savanna-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl border border-sand-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-obsidian-900 text-white p-4 flex justify-between items-center shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80')] bg-cover bg-center" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-terracotta-500 flex items-center justify-center font-display font-bold text-xl border-2 border-white/20 shadow-inner">
                BT
              </div>
              <div>
                <h3 className="font-bold font-display text-lg leading-none mb-1">Safari Concierge</h3>
                <p className="text-xs text-savanna-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-savanna-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="relative z-10 text-white/70 hover:text-white transition-colors hover:rotate-90 duration-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand-50/50">
            {messages.map((msg, idx) => {
              // Basic markdown to HTML
              let formatted = msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-terracotta-700">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br/>');
              
              return (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3.5 text-[15px] leading-relaxed shadow-md ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white rounded-br-sm" 
                        : "bg-white border border-sand-200 text-obsidian-800 rounded-bl-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatted }}
                  />
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-sand-200 rounded-2xl rounded-bl-sm p-4 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-sand-200 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about Western Kenya..."
                className="w-full pl-4 pr-12 py-3 rounded-full bg-sand-50 border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white text-sm transition-all text-obsidian-800"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-terracotta-600 text-white rounded-full hover:bg-terracotta-700 disabled:opacity-50 disabled:hover:bg-terracotta-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
