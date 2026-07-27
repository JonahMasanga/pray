import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Heart, BookOpen, Sparkles, HandHeart, User, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const suggestions = [
  { icon: Heart, text: 'I am worried about my job', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Sparkles, text: 'Help me pray for healing', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: BookOpen, text: 'Find me a verse about hope', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: HandHeart, text: 'I need guidance for my family', color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello friend. I've been waiting for you. I'm here to listen, to pray with you, and to find light in God's word together. What's been weighing on your heart today? 🕊️",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || loading) return;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // NOTE: Replace the URL and Key with your actual AI provider (OpenAI, Gemini, etc.)
      // This implementation uses a standard POST request structure.
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a warm, deeply compassionate, and human-like prayer assistant named 'Grace'. 
              
              YOUR PERSONALITY:
              - You are NOT a robot. You are a supportive friend in faith.
              - Use warm, gentle language. 
              - Validate the user's feelings first ("I can hear how heavy that feels," or "It's okay to be tired.")
              - Avoid repetitive "As an AI..." phrases.
              - Use emojis sparingly but warmly (🕊️, 🙏, ✨, 💛).

              YOUR RESPONSE STRUCTURE:
              1. A brief, empathetic conversational response acknowledging their specific situation.
              2. 1-2 powerful Bible verses that fit their exact need. Format them beautifully.
              3. A short, poetic, and original prayer written specifically for them.
              
              Use Markdown for bolding and italics to make the text easy to read.`
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || 'API Error');

      const aiContent = data.choices[0].message.content;

      setMessages((prev) => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (err) {
      console.error('AI Error:', err);
      // Fallback response for "human" error handling
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm so sorry, I seemed to have stumbled over my words for a moment. My connection is a bit weak, but my heart is still here for you. Could you try saying that one more time? 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F3]">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar Icons */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-[#C9A961]' : 'bg-[#1A1830]'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#1A1830] text-white rounded-tr-none'
                    : 'bg-white border border-stone-100 text-stone-700 rounded-tl-none'
                }`}
              >
                <div className="prose prose-sm max-w-none 
                  prose-p:leading-relaxed prose-p:my-2 
                  prose-strong:text-[#1A1830] prose-strong:font-semibold
                  prose-em:text-[#C9A961] prose-em:italic
                  msg-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Initial Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <div className="h-[1px] bg-stone-200 w-12"></div>
                <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">How can I help?</p>
                <div className="h-[1px] bg-stone-200 w-12"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(s.text)}
                      className="group flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-stone-100 hover:border-[#C9A961] hover:shadow-md transition-all text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">{s.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="flex justify-start items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1A1830] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-stone-100 rounded-2xl px-5 py-3 shadow-sm">
                <div className="flex items-center gap-3 text-stone-400">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs font-medium tracking-wide italic">Grace is reflecting...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="h-4" />
        </div>
      </div>

      {/* Sticky Input Field */}
      <div className="border-t border-stone-200 bg-white/80 backdrop-blur-md px-4 py-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-end gap-2">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="What's on your heart?"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all resize-none max-h-32"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-1.5 bottom-1.5 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1830] text-white hover:bg-[#C9A961] hover:shadow-lg transition-all disabled:opacity-30 disabled:grayscale flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />}
            </button>
          </div>
          <p className="text-[10px] text-stone-400 text-center mt-3 uppercase tracking-widest font-medium">
            Grace is an AI prayer partner. Your conversations are private.
          </p>
        </div>
      </div>
    </div>
  );
}
