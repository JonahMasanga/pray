import { BookOpen, Quote } from 'lucide-react';

export default function DevotionCard({ devotion, full = false }) {
  if (!devotion) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="bg-gradient-to-br from-[#1A1830] via-[#252348] to-[#1A1830] p-6 lg:p-8 text-white relative">
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-[#C9A961]/10 blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 text-[#C9A961] text-xs font-medium tracking-widest uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            {devotion.theme || 'Daily Devotion'}
          </div>
          <div className="relative">
            <Quote className="w-8 h-8 text-[#C9A961]/30 absolute -top-2 -left-1" />
            <p className="font-display text-lg lg:text-2xl font-light italic leading-relaxed pl-7">
              {devotion.verse_text}
            </p>
            <p className="text-[#C9A961] text-sm mt-3 pl-7">— {devotion.verse_reference}</p>
          </div>
        </div>
      </div>
      <div className="p-6 lg:p-8">
        {full ? (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
                Reflection
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed">{devotion.message}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
                Prayer
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed italic">
                {devotion.prayer}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
            {devotion.message}
          </p>
        )}
      </div>
    </div>
  );
}
