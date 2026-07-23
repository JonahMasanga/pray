import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import DevotionCard from '@/components/DevotionCard';
import { BookOpen, Calendar } from 'lucide-react';
import moment from 'moment';

export default function Devotion() {
  const [devotions, setDevotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Devotion
      .list('-created_date', 30)
      .then(setDevotions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = moment().format('YYYY-MM-DD');
  const todaysDevotion = devotions.find(
    (d) => moment(d.date).format('YYYY-MM-DD') === today
  );
  const latestDevotion = todaysDevotion || devotions[0];
  const pastDevotions = devotions.filter((d) => d.id !== latestDevotion?.id);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C9A961] text-sm font-medium tracking-widest uppercase mb-2">
            {moment().format('dddd, MMMM D')}
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
                        {moment(d.date).format('MMMM D, YYYY')}
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
