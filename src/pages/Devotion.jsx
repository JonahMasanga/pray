import { useState, useEffect } from 'react';
import DevotionCard from '@/components/DevotionCard';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockDevotions = [
  {
    id: 1,
    date: new Date(),
    verse_text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    verse_reference: 'Philippians 4:6',
    message: 'When life feels overwhelming, remember that prayer is your direct line to God. He invites us to share every concern, every fear, every hope with Him.',
  },
  {
    id: 2,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    verse_text: 'Trust in the LORD with all your heart and lean not on your own understanding.',
    verse_reference: 'Proverbs 3:5',
    message: 'Faith is not about understanding everything, but about trusting God even when things don\'t make sense.',
  },
  {
    id: 3,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    verse_text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.',
    verse_reference: 'Jeremiah 29:11',
    message: 'God\'s plans for your life are good. Even in uncertainty, He is working for your good.',
  },
  {
    id: 4,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    verse_text: 'I can do all things through Christ who strengthens me.',
    verse_reference: 'Philippians 4:13',
    message: 'Your strength comes not from yourself, but from your relationship with Christ.',
  },
  {
    id: 5,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    verse_text: 'Blessed is the one who trusts in the Lord, whose confidence is in him.',
    verse_reference: 'Jeremiah 17:7',
    message: 'True blessing comes from placing your trust and confidence in God.',
  },
];

export default function Devotion() {
  const [devotions, setDevotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setDevotions(mockDevotions);
      setLoading(false);
    }, 500);
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todaysDevotion = devotions.find(
    (d) => format(new Date(d.date), 'yyyy-MM-dd') === today
  );
  const latestDevotion = todaysDevotion || devotions[0];
  const pastDevotions = devotions.filter((d) => d.id !== latestDevotion?.id);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C9A961] text-sm font-medium tracking-widest uppercase mb-2">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1830]">
            Daily Devotion
          </h1>
          <p className="text-stone-500 mt-1">A verse, a message, and a prayer for today</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-[#1A1830] rounded-full animate-spin"></div>
          </div>
        ) : latestDevotion ? (
          <>
            <DevotionCard devotion={latestDevotion} full />

            {pastDevotions.length > 0 && (
              <div className="mt-12">
                <h2 className="font-heading text-xl font-semibold text-[#1A1830] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-stone-400" /> Past Devotions
                </h2>
                <div className="space-y-3">
                  {pastDevotions.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-stone-100"
                    >
                      <p className="text-xs text-stone-400 mb-1">
                        {format(new Date(d.date), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-stone-500 italic">"{d.verse_text}"</p>
                      <p className="text-xs text-[#C9A961] mt-1">— {d.verse_reference}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">No devotions available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
