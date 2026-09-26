import React, { useState } from 'react';
import { X, Sparkles, Send, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: "Hello Alex! I'm your AI Routine Assistant. I analyzed your daily habits — you're maintaining an 84% weekly consistency score and a 12-day streak! How can I help you plan your routine or optimize habits today?",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (userQuery?: string) => {
    const queryText = (userQuery || prompt).trim();
    if (!queryText) return;
    setMessages((prev) => [...prev, { role: 'user', text: queryText }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const lower = queryText.toLowerCase();
      let reply = "I suggest habit stacking! Try attaching your new habit right after an established routine anchor like morning meditation or post-workout hydration to build effortless momentum.";

      if (lower.includes('college') || lower.includes('class') || lower.includes('9 am to 4 pm')) {
        reply = `Here's a balanced routine based on your schedule:

6:30 AM — Wake up
7:00 AM — Breakfast
8:00 AM — Prepare for college
9:00 AM — College
4:30 PM — Break
5:00 PM — Study session
6:00 PM — Exercise
7:30 PM — Free time
8:30 PM — Assignment
10:00 PM — Wind down`;
      } else if (lower.includes('improve') || lower.includes('routine') || lower.includes('better')) {
        reply = `Based on your 84% consistency score and 12-day active streak:

1. ⚡ Shift Evening Study: Move late study blocks to 5:30 PM (before dinner) to avoid fatigue. You complete 87% of habits when done before 7 PM.
2. 📖 Habit Stacking: Pair your 20-page reading habit directly after your morning meditation for effortless momentum.
3. 💧 Hydration Trigger: Keep a 1L water bottle at your desk during your 90-minute Deep Work session.`;
      } else if (lower.includes('study') || lower.includes('python')) {
        reply = "For study habits like Python programming, set 45-minute Pomodoro blocks at 5:00 PM right after college. This prevents evening procrastination and keeps your streak strong!";
      } else if (lower.includes('streak') || lower.includes('consistency')) {
        reply = "You are currently holding a 12-day current streak! Your top performing habit is Meditation (87% adherence). To push for a 30-day streak, use your Streak Freeze shields on busy weekends.";
      }

      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-purple-500 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trackora AI Routine Assistant</h3>
              <p className="text-[11px] text-slate-400">Personalized habit & schedule intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-slate-600 custom-scrollbar">
          <span className="shrink-0 text-slate-400">Try asking:</span>
          <button
            onClick={() => handleSend("How can I improve my routine?")}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shrink-0 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 transition-colors"
          >
            ✨ How can I improve my routine?
          </button>
          <button
            onClick={() => handleSend("I have college from 9 AM to 4 PM. Make me a routine.")}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shrink-0 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 transition-colors"
          >
            🎓 College routine (9 AM - 4 PM)
          </button>
          <button
            onClick={() => handleSend("Habit stacking ideas for today")}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shrink-0 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 transition-colors"
          >
            🔗 Habit stacking
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#1C2833] text-white rounded-tr-xs font-medium'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs font-medium'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2 items-center text-slate-400 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Analyzing your habits & calendar...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to create a routine, reschedule habits, or boost focus..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

