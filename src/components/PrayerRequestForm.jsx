import { useState } from 'react';
//import { base44 } from '@/api/base44Client';
import { Globe, Lock, Loader2, Send } from 'lucide-react';

export default function PrayerRequestForm({ onSubmit }) {
  const [requesterName, setRequesterName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.PrayerRequest.create({
        requester_name: requesterName.trim(),
        title: title.trim(),
        description: description.trim(),
        category,
        is_public: isPublic,
        prayer_count: 0,
        is_answered: false,
      });
      setRequesterName('');
      setTitle('');
      setDescription('');
      setCategory('other');
      setIsPublic(true);
      if (onSubmit) onSubmit();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pr-name" className="block text-sm font-medium text-stone-700 mb-1.5">
            Your Name
          </label>
          <input
            id="pr-name"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="pr-title" className="block text-sm font-medium text-stone-700 mb-1.5">
            Title
          </label>
          <input
            id="pr-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Please pray for my family"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="pr-desc" className="block text-sm font-medium text-stone-700 mb-1.5">
            Your Request
          </label>
          <textarea
            id="pr-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share what's on your heart..."
            rows={4}
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pr-cat" className="block text-sm font-medium text-stone-700 mb-1.5">
              Category
            </label>
            <select
              id="pr-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
            >
              <option value="health">Health</option>
              <option value="family">Family</option>
              <option value="career">Career</option>
              <option value="financial">Financial</option>
              <option value="spiritual">Spiritual</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Visibility</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  isPublic
                    ? 'bg-[#1A1830] text-white border-[#1A1830]'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  !isPublic
                    ? 'bg-[#1A1830] text-white border-[#1A1830]'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Private
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1830] text-white hover:bg-[#2A2840] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sharing...</>
            ) : (
              <><Send className="w-4 h-4" /> Share Prayer Request</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
