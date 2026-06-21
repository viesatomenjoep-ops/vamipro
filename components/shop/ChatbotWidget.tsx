'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Excuses, er ging iets mis met mijn verbinding. Probeer het later nog eens!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-bg shadow-lg shadow-accent/20 transition-transform duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open klantenservice chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-50 flex flex-col overflow-hidden bg-panel shadow-2xl transition-all duration-300
          bottom-24 right-4 h-[500px] max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] sm:w-[350px] sm:bottom-6 sm:right-6 rounded-xl border hairline
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b hairline bg-panel-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border hairline">
              <img src="/images/logo.png" alt="VaMiPro Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <img src="/images/logo.png" alt="VaMiPro" className="h-3 w-auto" />
                <h3 className="font-display text-sm font-medium">Assistent</h3>
              </div>
              <p className="text-xs text-accent">Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-fg-faint hover:text-fg transition-colors p-1"
            aria-label="Sluit chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-sm text-fg-muted mt-4">
              <p>Welkom bij Fami Pro! 👋</p>
              <p className="mt-2">Heb je vragen over onze detailing producten, verzending of retourneren? Stel ze gerust!</p>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-panel-2 text-fg' : 'bg-accent/10 text-accent'}`}>
                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-accent text-bg rounded-tr-sm' 
                  : 'bg-panel-2 text-fg rounded-tl-sm whitespace-pre-wrap'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Bot size={14} />
              </div>
              <div className="bg-panel-2 text-fg rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 size={16} className="animate-spin text-accent" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t hairline bg-panel-2 p-3">
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Typ hier je vraag..."
              className="flex-1 rounded-full border hairline bg-bg px-4 py-2 text-sm text-fg outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
