import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Heart, BookOpen, Sparkles, HandHeart, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello friend. I'm Grace. I'm here to listen, pray, and find light in God's word with you. What's on your heart today? 🕊️",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // DEBUG: Checking for API Key
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error("Configuration Error: VITE_OPENAI_API_KEY is missing in your .env file.");
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: "You are Grace, a warm, human-like prayer assistant. Keep responses empathetic, concise, and include a short prayer."
          }, { role: 'user', content: userMessage }],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // This will now show the actual error (like 401 or 429) on your phone
        throw new Error(data.error?.message || `API Status: ${response.status}`);
      }

      const aiContent = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (err) {
      // Now you will see the exact error on your phone screen!
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Debug Info:**\n\nI encountered an error:\n> ${err.message}\n\n*If this is a 401 error, your API Key is invalid. If it's 429, you've used your free limit.*`
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F3] p-4">
      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user' ? 'bg-[#1A1830] text-white' : 'bg-white border text-stone-700'}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-stone-400 italic text-sm">Grace is reflecting...</div>}
        <div ref={scrollRef} />
      </div>

      <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-2xl border p-3 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your prayer..."
          />
          <button onClick={() => handleSend()} className="bg-[#1A1830] text-white p-3 rounded-2xl">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
