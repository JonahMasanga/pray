import { useState, useRef, useEffect } from 'react';
//import { base44 } from '@/api/base44Client';
import { Send, Loader2, Bot, Heart, BookOpen, Sparkles, HandHeart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const suggestions = [
  { icon: Heart, text: 'I am worried about my job', color: 'text-blue-500' },
  { icon: Sparkles, text: 'Help me pray for healing', color: 'text-pink-500' },
  { icon: BookOpen, text: 'Find me a verse about hope', color: 'text-amber-500' },
  { icon: HandHeart, text: 'I need guidance for my family', color: 'text-purple-500' },
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello, I'm your AI prayer assistant. I'm here to help you write prayers, find Bible verses, and receive encouragement. How can I support you today? 💛",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate AI prayer assistant in a prayer community app called PrayerHub. Your role is to help people by:
1. Writing heartfelt, personalized prayers based on the user's situation
2. Sharing relevant Bible verses with full references (book, chapter, verse)
3. Offering spiritual encouragement and hope

Be warm, empathetic, and uplifting. Write prayers that are poetic but accessible. Always include at least one relevant Bible verse.

User's message: "${userMessage}"

Respond with: encouraging words, 1-3 relevant Bible verses (with full text and reference), and a personalized prayer.`,
        response_json_schema: {
          type: 'object',
          properties: {
            encouragement: { type: 'string', description: 'Warm, empathetic words of encouragement and understanding' },
            verses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  reference: { type: 'string', description: 'Full Bible reference, e.g. Philippians 4:6' },
                  text: { type: 'string', description: 'The verse text' },
                },
              },
              description: '1-3 relevant Bible verses',
            },
            prayer: { type: 'string', description: 'A heartfelt, personalized prayer related to the user situation' },
          },
          required: ['encouragement', 'verses', 'prayer'],
        },
      });

      let content = '';
      if (response.encouragement) {
        content += response.encouragement + '\n\n';
      }
      if (response.verses && response.verses.length > 0) {
        content += '**Scripture for You**\n\n';
        response.verses.forEach((v) => {
          content += `*"${v.text}"* — **${v.reference}**\n\n`;
        });
      }
      if (response.prayer) {
        content += '**A Prayer for You**\n\n' + response.prayer;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: content || "I'm here for you. Tell me more about what's on your heart." },
      ]);
    } catch (err) {
      console.error('AI prayer assistant error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, I'm having trouble responding right now. Please try again in a moment. 🙏",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#1A1830] text-white'
                    : 'bg-white border border-stone-100 text-stone-700'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-strong:text-[#1A1830] prose-em:text-[#C9A961] prose-li:my-0.5">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="pt-4">
              <p className="text-xs text-stone-400 text-center mb-3">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(s.text)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-stone-100 hover:border-[#C9A961] hover:shadow-sm transition-all text-left"
                    >
                      <Icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                      <span className="text-sm text-stone-600">{s.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-stone-400">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm">Praying and reflecting...</span>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-stone-100 bg-white px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Share what's on your heart..."
            className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1830] text-white hover:bg-[#2A2840] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
