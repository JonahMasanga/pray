import { useState } from 'react';
//import { base44 } from '@/api/base44Client';
import { Loader2, Send } from 'lucide-react';

const postTypes = [
  { value: 'general', label: 'General' },
  { value: 'praise', label: 'Praise' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'question', label: 'Question' },
];

export default function CommunityPostForm({ onSubmit }) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.CommunityPost.create({
        author_name: authorName.trim(),
        content: content.trim(),
        post_type: postType,
      });
      setAuthorName('');
      setContent('');
      setPostType('general');
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
          <label htmlFor="cp-name" className="block text-sm font-medium text-stone-700 mb-1.5">
            Your Name
          </label>
          <input
            id="cp-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="cp-content" className="block text-sm font-medium text-stone-700 mb-1.5">
            Share with the community
          </label>
          <textarea
            id="cp-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a thought, prayer, or encouragement..."
            rows={3}
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Post Type</label>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setPostType(t.value)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  postType === t.value
                    ? 'bg-[#1A1830] text-white border-[#1A1830]'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1830] text-white hover:bg-[#2A2840] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
