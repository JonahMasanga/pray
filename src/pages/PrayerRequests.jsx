import { useState, useEffect } from 'react';
import { Plus, Heart, X } from 'lucide-react';
import PrayerRequestCard from '@/components/PrayerRequestCard';
import PrayerRequestForm from '@/components/PrayerRequestForm';
import { getPrayerRequests } from '@/lib/db';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'health', label: 'Health' },
  { value: 'family', label: 'Family' },
  { value: 'career', label: 'Career' },
  { value: 'financial', label: 'Financial' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'other', label: 'Other' },
];

export default function PrayerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const firestoreRequests = await getPrayerRequests();
      const sortedRequests = [...firestoreRequests].sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );
      setRequests(sortedRequests);
    } catch (err) {
      console.error('Failed to load prayer requests:', err);
      setRequests([]);
      setError('Unable to load prayer requests right now. Please try again.');
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    setShowForm(false);
    loadRequests();
  };

  const filtered = category === 'all' ? requests : requests.filter((r) => r.category === category);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1830]">
              Prayer Requests
            </h1>
            <p className="text-stone-500 mt-1">Share your heart and pray for others</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1830] hover:bg-[#2A2840] text-white text-sm font-medium transition-all"
          >
            {showForm ? <><X className="w-4 h-4" /> Close</> : <><Plus className="w-4 h-4" /> Share Request</>}
          </button>
        </div>

        {/* Form */}
        {showForm && <PrayerRequestForm onSubmit={handleSubmit} />}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-[#1A1830] text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-stone-400">Loading prayer requests...</div>
        ) : error ? (
          <div className="text-center py-20 text-stone-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">No prayer requests in this category yet.</p>
            <p className="text-stone-400 text-sm mt-1">Be the first to share.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((req) => (
              <PrayerRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
