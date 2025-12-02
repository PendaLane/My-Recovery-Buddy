import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getAICoachResponse } from '../services/geminiService';
import { Send, Bot, Loader2 } from 'lucide-react';

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there. I'm your Recovery Buddy. I'm here to listen, offer support, or help you work through a tough moment. How are you feeling today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiText = await getAICoachResponse(messages, input);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-3xl mx-auto bg-white rounded-soft shadow-lg border border-penda-border overflow-hidden">
      <div className="bg-penda-bg p-4 border-b border-penda-border flex items-center gap-3">
        <div className="bg-white border border-penda-purple p-2 rounded-full text-penda-purple">
            <Bot size={24} />
        </div>
        <div>
            <h2 className="font-bold text-penda-purple">My AI Companion</h2>
            <p className="text-xs text-penda-light">Private, one-on-one support. Be kind to yourself and protect your privacy.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fffdf8]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-firm p-3 ${
                msg.role === 'user'
                  ? 'bg-penda-purple text-white'
                  : 'bg-white text-penda-text border border-penda-border shadow-sm'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-firm border border-penda-border shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-penda-purple" size={16} />
              <span className="text-xs text-penda-light">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-penda-border">
        <div className="flex items-center gap-2 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share a win, a struggle, or a word of encouragement..."
            className="w-full bg-white border border-penda-border rounded-firm px-4 py-3 pr-12 text-sm focus:outline-none focus:border-penda-purple focus:ring-1 focus:ring-penda-purple resize-none h-14"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-penda-purple text-white rounded-firm hover:bg-penda-light disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
