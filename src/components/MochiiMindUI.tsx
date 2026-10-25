import React, { useState } from 'react';
import { MochiiMindService } from '../services/MochiiMindService';
import { useGameStore } from '../store/gameStore';

export default function MochiiMindUI({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<{role: 'user' | 'mind', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dex = useGameStore(s => s.dex);
  const currentMap = useGameStore(s => s.currentMap);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    const seenCount = Object.keys(dex).filter(k => dex[k] === 'seen' || dex[k] === 'caught').length;
    const caughtCount = Object.keys(dex).filter(k => dex[k] === 'caught').length;
    const context = `Player context: Current map is ${currentMap}. Mochiioteca stats: Seen ${seenCount}, Caught ${caughtCount}. Raw Dex data: ${JSON.stringify(dex)}`;
    const response = await MochiiMindService.consult(userMessage, context);

    setMessages(prev => [...prev, { role: 'mind', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-slate-950 border-l border-teal-900 shadow-2xl flex flex-col z-50 transform transition-transform text-sm">
      <div className="bg-slate-900 border-b border-teal-900 p-4 flex justify-between items-center">
        <h2 className="text-teal-400 font-bold uppercase tracking-wider">MochiiMind Uplink</h2>
        <button onClick={onClose} className="text-teal-500 hover:text-white transition-colors">
          [X]
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-slate-500 italic text-center text-xs mt-4">
            Connection established. The MochiiMind awaits your query.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`px-3 py-2 max-w-[90%] rounded ${msg.role === 'user' ? 'bg-teal-900/50 border border-teal-800 text-teal-100' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-teal-500 animate-pulse text-xs">Processing data...</div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-teal-900 text-slate-300">
        <div className="flex bg-slate-950 border border-slate-700 rounded overflow-hidden focus-within:border-teal-500 transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent px-3 py-2 focus:outline-none"
            placeholder="Query the Mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button 
            className="bg-slate-800 hover:bg-slate-700 px-4 font-bold text-teal-500 uppercase tracking-widest disabled:opacity-50 transition-colors"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
