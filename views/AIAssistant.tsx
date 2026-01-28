import React, { useState, useRef, useEffect } from 'react';
import { generateCodeAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import ReactMarkdown from 'react-markdown';

// Simple Markdown renderer substitute (if package not available, we map it, but standard ReactMarkdown is widely used)
// We will just assume simple text rendering for this constrained environment if we didn't add the package, 
// but let's just do a simple pre-wrap for the message if we don't want to rely on external complex renderers in this specific "no-install" prompt simulation.
// Actually, standard practice for these prompts allows popular libraries. I'll use a basic pre/code display to be safe and robust.

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] lg:max-w-[75%] rounded-2xl p-4 ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
      }`}>
        <div className="flex items-center gap-2 mb-2 opacity-70 text-xs uppercase tracking-wider font-bold">
           <Icon name={isUser ? 'User' : 'Bot'} size={14} />
           {isUser ? 'You' : 'Gemini Architect'}
        </div>
        <div className="prose prose-invert max-w-none text-sm leading-relaxed overflow-x-auto">
            {/* Simple parsing for code blocks */}
            {message.text.split(/(```[\s\S]*?```)/g).map((part, index) => {
                if (part.startsWith('```')) {
                    const content = part.replace(/^```[a-z]*\n/, '').replace(/```$/, '');
                    return (
                        <div key={index} className="bg-[#0f172a] p-3 rounded-md my-2 border border-slate-800 font-mono text-xs overflow-x-auto relative group">
                            <pre className="m-0">{content}</pre>
                        </div>
                    );
                }
                return <span key={index} className="whitespace-pre-wrap">{part}</span>;
            })}
        </div>
        <div className="text-right mt-1 opacity-50 text-[10px]">
            {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your Senior Dev Assistant. Ask me anything about ABAP, UI5, SQL, or JS.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await generateCodeAssistantResponse(input);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-white font-bold flex items-center gap-2">
            <Icon name="Sparkles" className="text-yellow-400" />
            Architect Assistant
        </h2>
        <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">Model: Gemini Flash</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#1e293b]">
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-slate-700 rounded-2xl p-4 rounded-bl-none flex items-center gap-2">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="E.g., 'How do I perform a left outer join in ABAP OpenSQL?'"
            className="w-full bg-[#0f172a] text-slate-200 border border-slate-600 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-14"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 text-center">
            AI can make mistakes. Review generated code before deploying to production.
        </div>
      </div>
    </div>
  );
};
