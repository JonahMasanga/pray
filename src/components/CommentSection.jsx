import { useState, useEffect, useRef } from 'react';
import { Send, Heart, MessageCircle, Loader2 } from 'lucide-react';
import moment from 'moment';
import { getComments, addComment } from '@/lib/db';

export default function CommentSection({ prayerRequestId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [type, setType] = useState('comment');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const latestLoadIdRef = useRef(0);

  useEffect(() => {
    loadComments();
  }, [prayerRequestId]);

  const loadComments = async () => {
    const loadId = latestLoadIdRef.current + 1;
    latestLoadIdRef.current = loadId;
    setLoading(true);
    try {
      const data = await getComments(prayerRequestId);
      if (latestLoadIdRef.current === loadId) {
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
      if (latestLoadIdRef.current === loadId) {
        setComments([]);
      }
    } finally {
      if (latestLoadIdRef.current === loadId) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await addComment({
        prayer_request_id: prayerRequestId,
        content: content.trim(),
        type,
      });

      setContent('');
      setType('comment');
      await loadComments();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
      <h3 className="font-heading text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-stone-400" />
        Encouragement & Comments
      </h3>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-stone-300 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-6">
          Be the first to offer encouragement. 🙏
        </p>
      ) : (
        <div className="space-y-4 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  c.type === 'encouragement' ? 'bg-amber-50' : 'bg-stone-100'
                }`}
              >
                {c.type === 'encouragement' ? (
                  <Heart className="w-4 h-4 text-amber-500" />
                ) : (
                  <MessageCircle className="w-4 h-4 text-stone-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-600 leading-relaxed">{c.content}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {moment(c.created_date).format('MMM D, h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="pt-4 border-t border-stone-100">
        <div className="flex gap-2 mb-2.5">
          <button
            type="button"
            onClick={() => setType('comment')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              type === 'comment'
                ? 'bg-[#1A1830] text-white border-[#1A1830]'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
            }`}
          >
            Comment
          </button>
          <button
            type="button"
            onClick={() => setType('encouragement')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              type === 'encouragement'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
            }`}
          >
            Encouragement
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={type === 'encouragement' ? 'Offer words of encouragement...' : 'Share a comment...'}
            className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1830] text-white hover:bg-[#2A2840] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
