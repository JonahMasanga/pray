import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Globe, Lock, Check } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
import moment from 'moment';
import { getPrayerRequestById, incrementPrayerCount } from '@/lib/db';

const categoryLabels = {
  health: 'Health',
  family: 'Family',
  career: 'Career',
  financial: 'Financial',
  spiritual: 'Spiritual',
  other: 'Other',
};

export default function PrayerRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prayed, setPrayed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`prayed_${id}`) === 'true';
  });
  const [praying, setPraying] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const firestoreRequest = await getPrayerRequestById(id);
        setRequest(firestoreRequest);
      } catch (err) {
        console.error('Failed to load prayer request:', err);
        setRequest(null);
      }
      setLoading(false);
    };

    loadRequest();
  }, [id]);

  const handlePray = async () => {
    if (prayed || praying || !request || !request.id) return;
    setPraying(true);
    const previousCount = request.prayer_count || 0;
    const previousPrayed = prayed;
    try {
      const newCount = previousCount + 1;
      setRequest({ ...request, prayer_count: newCount });
      await incrementPrayerCount(request.id);
      localStorage.setItem(`prayed_${id}`, 'true');
      setPrayed(true);
    } catch (err) {
      console.error('Failed to update prayer count:', err);
      setRequest((prev) => (
        prev
          ? { ...prev, prayer_count: previousCount }
          : prev
      ));
      setPrayed(previousPrayed);
    }
    setPraying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-[#1A1830] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-stone-500">
        Prayer request not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        <Link
          to="/requests"
          className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-[#1A1830] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prayer Requests
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              {categoryLabels[request.category] || 'Other'}
            </span>
            {request.is_public ? (
              <Globe className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-stone-400" />
            )}
            {request.is_answered && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                Answered
              </span>
            )}
            <span className="text-xs text-stone-400 ml-auto">
              {moment(request.created_date).format('MMMM D, YYYY')}
            </span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-[#1A1830] mb-4 leading-tight">
            {request.title}
          </h1>
          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </p>
          {request.requester_name && (
            <p className="text-sm text-stone-400 mt-4">
              Shared by <span className="font-medium text-stone-500">{request.requester_name}</span>
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-500">
              <Heart className="w-5 h-5" />
              <span className="font-medium">{request.prayer_count || 0}</span>
              <span className="text-sm">people praying</span>
            </div>
            <button
              onClick={handlePray}
              disabled={prayed || praying}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                prayed
                  ? 'bg-green-50 text-green-600 cursor-default'
                  : 'bg-[#1A1830] text-white hover:bg-[#2A2840]'
              }`}
            >
              {prayed ? (
                <><Check className="w-4 h-4" /> Prayed</>
              ) : (
                <><Heart className="w-4 h-4" /> I Pray for This</>
              )}
            </button>
          </div>
        </div>

        <CommentSection prayerRequestId={id} />
      </div>
    </div>
  );
}
