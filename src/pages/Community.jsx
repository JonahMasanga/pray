import { useState, useEffect } from 'react';
import { Plus, X, MessageCircle } from 'lucide-react';
import CommunityPostForm from '@/components/CommunityPostForm';
import CommunityPostCard from '@/components/CommunityPostCard';

// Mock data
const mockPosts = [
  {
    id: 1,
    author_name: 'Grace',
    content: 'Feeling grateful for God\'s faithfulness. He never leaves us alone.',
    post_type: 'praise',
    created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 12,
    replies: 3,
  },
  {
    id: 2,
    author_name: 'John',
    content: 'How do you find time for daily prayer amidst a busy schedule?',
    post_type: 'question',
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 8,
    replies: 5,
  },
  {
    id: 3,
    author_name: 'Maria',
    content: 'Just finished reading a powerful devotion. Feeling blessed and encouraged.',
    post_type: 'general',
    created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 15,
    replies: 2,
  },
];

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadPosts = () => {
    // Simulate API delay
    setTimeout(() => {
      // Get posts from localStorage if available, otherwise use mock data
      const storedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
      const allPosts = [...storedPosts, ...mockPosts];
      setPosts(allPosts);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = () => {
    setShowForm(false);
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1830]">
              Community
            </h1>
            <p className="text-stone-500 mt-1">Connect, share, and encourage one another</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1830] hover:bg-[#2A2840] text-white text-sm font-medium transition-all"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" /> Close
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> New Post
              </>
            )}
          </button>
        </div>

        {showForm && <CommunityPostForm onSubmit={handleSubmit} />}

        {loading ? (
          <div className="text-center py-20 text-stone-400">Loading community posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">
              No posts yet. Be the first to start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
