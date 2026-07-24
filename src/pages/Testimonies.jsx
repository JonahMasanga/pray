import { useState, useEffect } from 'react';
import { Plus, Sparkles, Loader2, X } from 'lucide-react';
import TestimonyCard from '@/components/TestimonyCard';
import { getTestimonies, addTestimony } from '@/lib/db';

// Mock data
const mockTestimonies = [
  {
    id: 1,
    title: 'God healed my mother',
    description: 'After months of prayer, my mother\'s doctors gave her a clean bill of health. It\'s truly a miracle!',
    verse_reference: 'Psalm 30:2',
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: 'Got the job of my dreams',
    description: 'Against all odds, I received the job offer I\'ve been praying for. God\'s timing is perfect.',
    verse_reference: 'Proverbs 3:5-6',
    created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: 'Restored relationship',
    description: 'Through prayer and God\'s grace, a broken relationship in my family has been restored.',
    verse_reference: 'Ephesians 4:2-3',
    created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: 'Financial blessing',
    description: 'God provided in ways I never expected. My faith in His provision has been restored.',
    verse_reference: 'Philippians 4:19',
    created_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: 'Addiction overcome',
    description: 'By God\'s grace and the support of prayer warriors, I\'ve overcome my struggle with addiction.',
    verse_reference: '2 Corinthians 12:9',
    created_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
];

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [verse, setVerse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTestimonies();
  }, []);

  const loadTestimonies = async () => {
    try {
      const firestoreTestimonies = await getTestimonies();
      // Merge Firestore results with mock data; Firestore records appear first.
      const allTestimonies = [...firestoreTestimonies, ...mockTestimonies];
      setTestimonies(allTestimonies);
    } catch (err) {
      console.error('Failed to load testimonies:', err);
      setTestimonies([...mockTestimonies]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setSubmitting(true);
    
    try {
      await addTestimony({
        title: title.trim(),
        description: description.trim(),
        verse_reference: verse.trim(),
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setVerse('');
      setShowForm(false);
      
      // Reload testimonies
      loadTestimonies();
    } catch (err) {
      console.error(err);
      setError('Failed to submit testimony. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1830]">
              Testimonies
            </h1>
            <p className="text-stone-500 mt-1">Share how God has answered prayers</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1830] hover:bg-[#2A2840] text-white text-sm font-medium transition-all"
          >
            {showForm ? <><X className="w-4 h-4" /> Close</> : <><Plus className="w-4 h-4" /> Share Testimony</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-heading text-lg font-semibold text-stone-800">
                  Share Your Testimony
                </h3>
                <button type="button" onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5 text-stone-400 hover:text-stone-600" />
                </button>
              </div>
              <div>
                <label htmlFor="t-title" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Title
                </label>
                <input
                  id="t-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., God healed my mother"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="t-desc" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Your Testimony
                </label>
                <textarea
                  id="t-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share what God has done..."
                  rows={5}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all resize-none"
                />
              </div>
              <div>
                <label htmlFor="t-verse" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Related Bible Verse (Optional)
                </label>
                <input
                  id="t-verse"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="e.g., Psalm 118:1"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1830] hover:bg-[#2A2840] text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sharing...</>
                  ) : (
                    'Share Testimony'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-stone-400">Loading testimonies...</div>
        ) : testimonies.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">No testimonies yet.</p>
            <p className="text-stone-400 text-sm mt-1">Share how God has answered your prayers.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonies.map((t) => (
              <TestimonyCard key={t.id} testimony={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
