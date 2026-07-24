import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Lock, Globe, Check } from 'lucide-react';
import { incrementPrayerCount } from '@/lib/db';

const categoryConfig = {
  health: { label: 'Health', cls: 'bg-red-50 text-red-600' },
  family: { label: 'Family', cls: 'bg-pink-50 text-pink-600' },
  career: { label: 'Career', cls: 'bg-blue-50 text-blue-600' },
  financial: { label: 'Financial', cls: 'bg-amber-50 text-amber-700' },
  spiritual: { label: 'Spiritual', cls: 'bg-purple-50 text-purple-600' },
  other: { label: 'Other', cls: 'bg-stone-100 text-stone-600' },
};

export default function PrayerRequestCard({ request }) {
  const [prayed, setPrayed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`prayed_${request.id}`) === 'true';
  });
  const [count, setCount] = useState(request.prayer_count || 0);
  const [loading, setLoading] = useState(false);

  const handlePray = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (prayed || loading || !request?.id) return;

    setLoading(true);
    const previousCount = count;
    const previousPrayed = prayed;
    try {
      const newCount = previousCount + 1;

      // Update local UI state immediately
      setCount(newCount);
      setPrayed(true);
      localStorage.setItem(`prayed_${request.id}`, 'true');
      await incrementPrayerCount(request.id);
    } catch (err) {
      console.error(err);
      setCount(previousCount);
      setPrayed(previousPrayed);
      if (!previousPrayed) {
        localStorage.removeItem(`prayed_${request.id}`);
      }
    }
    setLoading(false);
  };

  const cat = categoryConfig[request.category] || categoryConfig.other;

  return (
    <Link to={`/requests/${request.id}`} className="block group">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md hover:border-stone-200 transition-all duration-300 h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cat.cls}`}>{cat.label}</span>
          {request.is_public ? (
            <Globe className="w-3.5 h-3.5 text-stone-300" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-stone-300" />
          )}
          {request.is_answered && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 ml-auto">
              Answered
            </span>
          )}
        </div>
        <h3 className="font-heading text-lg font-semibold text-stone-800 mb-2 group-hover:text-[#1A1830] transition-colors leading-snug">
          {request.title}
        </h3>
        <p className="text-sm text-stone-500 line-clamp-2 mb-3 leading-relaxed">{request.description}</p>
        {request.requester_name && (
          <p className="text-xs text-stone-400 mb-3">
            Shared by <span className="font-medium text-stone-500">{request.requester_name}</span>
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-stone-50">
          <span className="flex items-center gap-1.5 text-xs text-stone-400">
            <Heart className="w-3.5 h-3.5" /> {count} {count === 1 ? 'prayer' : 'prayers'}
          </span>
          <button
            onClick={handlePray}
            disabled={prayed || loading}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              prayed
                ? 'bg-green-50 text-green-600 cursor-default'
                : 'bg-[#1A1830] text-white hover:bg-[#2A2840]'
            }`}
          >
            {prayed ? (
              <><Check className="w-3.5 h-3.5" /> Prayed</>
            ) : (
              <><Heart className="w-3.5 h-3.5" /> I Pray</>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
