import React, { useState } from 'react';
import { X, Send, User, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TrackerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackerChatModal: React.FC<TrackerChatModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Coach Maya',
      time: '08:15 AM',
      text: 'Great job logging your morning meditation, Elena! Remember to stay hydrated before your afternoon deep work block.',
      isMe: false,
    },
    {
      sender: 'Elena C.',
      time: '08:20 AM',
      text: 'Thanks Maya! Feeling focused today. Quiet time session starts soon.',
      isMe: true,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      sender: 'Elena C.',
      time: 'Just now',
      text: input.trim(),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'Coach Maya',
          time: 'Just now',
          text: 'Cheering for you! Keep building that daily consistency! 🌟',
          isMe: false,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Coach Maya</h3>
              <p className="text-[10px] text-emerald-600 font-medium">● Active habit accountability partner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.isMe
                    ? 'bg-[#1C2833] text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message Coach Maya..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
