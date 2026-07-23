import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Heart, Bot, Gift, Bell, ArrowRight } from 'lucide-react';
import PrayerRequestCard from '@/components/PrayerRequestCard';
import TestimonyCard from '@/components/TestimonyCard';
import DevotionCard from '@/components/DevotionCard';

export default function Home() {
  const [requests, setRequests] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [devotion, setDevotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.PrayerRequest.filter({ is_public: true }, '-created_date', 4).catch(() => []),
      base44.entities.Testimony.list('-created_date', 3).catch(() => []),
      base44.entities.Devotion.list('-created_date', 1).catch(() => []),
    ]).then(([reqs, test, dev]) => {
      setRequests(reqs);
      setTestimonies(test);
      setDevotion(dev[0] || null);
    }).finally(() => setLoading(false));
  }, []);

  const enableReminders = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('PrayerHub Reminder', {
          body: 'Take 5 minutes to pray today 🙏',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1830] via-[#252348] to-[#1A1830] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-[#C9A961] blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-[#C9A961] blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 lg:py-24 text-center">
          <p className="text-[#C9A961] text-sm font-medium tracking-widest uppercase mb-4">
            Welcome to PrayerHub
          </p>
          <blockquote className="font-display text-2xl lg:text-4xl font-light leading-relaxed max-w-3xl mx-auto">
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
          </blockquote>
          <p className="text-white/60 mt-4 text-sm">— Philippians 4:6</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link to="/requests">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A961] hover:bg-[#B89850] text-[#1A1830] font-medium text-sm transition-all">
                <Heart className="w-4 h-4" /> Share a Prayer Request
              </button>
            </Link>
            <Link to="/assistant">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-medium text-sm transition-all">
                <Bot className="w-4 h-4" /> Find Encouragement
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12 space-y-12">
        {/* Prayer Reminder */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 lg:p-6 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-stone-800">Prayer Reminder</h3>
              <p className="text-sm text-stone-500">Take 5 minutes to pray today</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={enableReminders}
              className="px-4 py-2 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm font-medium transition-all"
            >
              Enable Reminders
            </button>
            <Link to="/requests">
              <button className="px-4 py-2 rounded-xl bg-[#1A1830] hover:bg-[#2A2840] text-white text-sm font-medium transition-all">
                Pray Now
              </button>
            </Link>
          </div>
        </div>

        {/* Devotion */}
        {devotion && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-semibold text-[#1A1830]">Today's Devotion</h2>
              <Link to="/devotion" className="text-sm text-stone-400 hover:text-[#C9A961] inline-flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <DevotionCard devotion={devotion} />
          </section>
        )}

        {/* Prayer Requests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold text-[#1A1830]">Recent Prayer Requests</h2>
            <Link to="/requests" className="text-sm text-stone-400 hover:text-[#C9A961] inline-flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-stone-400">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              No prayer requests yet. Be the first to share!
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {requests.map((req) => (
                <PrayerRequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </section>

        {/* Testimonies */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold text-[#1A1830]">Recent Testimonies</h2>
            <Link to="/testimonies" className="text-sm text-stone-400 hover:text-[#C9A961] inline-flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {testimonies.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              No testimonies yet. Share your answered prayers!
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {testimonies.map((test) => (
                <TestimonyCard key={test.id} testimony={test} />
              ))}
            </div>
          )}
        </section>

        {/* Feature highlights */}
        <section className="grid md:grid-cols-2 gap-4">
          <Link to="/assistant" className="block">
            <div className="bg-gradient-to-br from-[#1A1830] to-[#252348] rounded-2xl p-6 text-white hover:shadow-lg transition-all h-full">
              <Bot className="w-8 h-8 text-[#C9A961] mb-3" />
              <h3 className="font-heading text-xl font-semibold">AI Prayer Assistant</h3>
              <p className="text-white/60 text-sm mt-1 leading-relaxed">
                Get help writing prayers, finding Bible verses, and receiving encouragement.
              </p>
              <span className="inline-flex items-center gap-1 text-[#C9A961] text-sm mt-3">
                Try it now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
          <Link to="/donate" className="block">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all h-full">
              <Gift className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-heading text-xl font-semibold text-stone-800">Support Our Ministry</h3>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed">
                Your generosity helps sustain our prayer community and ministry operations.
              </p>
              <span className="inline-flex items-center gap-1 text-amber-600 text-sm mt-3">
                Donate now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
