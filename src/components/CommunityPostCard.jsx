import { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
  praise: { label: 'Praise', cls: 'bg-amber-50 text-amber-600' },
  prayer: { label: 'Prayer', cls: 'bg-purple-50 text-purple-600' },
  question: { label: 'Question', cls: 'bg-blue-50 text-blue-600' },
  general: { label: 'General', cls: 'bg-stone-100 text-stone-600' },
};

export default function CommunityPostCard({ post }) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyName, setReplyName] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getStorageKey = () => `communityReplies_${post.id}`;

  const loadReplies = async () => {
    try {
      const raw = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      const parsed = raw.map((r) => ({
        ...r,
        created_date: new Date(r.created_date),
      }));
      setReplies(parsed.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
    } catch (err) {
      console.error(err);
      setReplies([]);
    }
  };

  useEffect(() => {
    if (showReplies) loadReplies();
  }, [showReplies]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      const newReply = {
        id: Date.now(),
        post_id: post.id,
        author_name: replyName.trim(),
        content: replyContent.trim(),
        created_date: new Date(),
      };

      const existing = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      localStorage.setItem(getStorageKey(), JSON.stringify([...existing, newReply]));

      setReplyName('');
      setReplyContent('');
      loadReplies();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const type = typeConfig[post.post_type] || typeConfig.general;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${type.cls}`}>
          {type.label}
        </span>
        <span className="text-xs text-stone-400 ml-auto">
          {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
        </span>
      </div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#1A1830] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
          {post.author_name?.charAt(0).toUpperCase() || '?'}
        </div>
        <span className="font-medium text-stone-700 text-sm">{post.author_name}</span>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <button
        onClick={() => setShowReplies(!showReplies)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#C9A961] transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {showReplies ? 'Hide' : 'Reply'}
        {replies.length > 0 && !showReplies && ` (${replies.length})`}
      </button>

      {showReplies && (
        <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-stone-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {reply.author_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="font-medium text-stone-700 text-xs">{reply.author_name}</span>
                <span className="text-[10px] text-stone-400 ml-auto">
                   {formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">{reply.content}</p>
            </div>
          ))}

          <form onSubmit={handleReply} className="space-y-2">
            <input
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
            />
            <div className="flex gap-2">
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={submitting || !replyName.trim() || !replyContent.trim()}
                className="inline-flex items-center justify-center w-10 rounded-xl bg-[#1A1830] text-white hover:bg-[#2A2840] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
