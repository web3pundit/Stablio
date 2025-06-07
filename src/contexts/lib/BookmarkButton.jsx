import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './SupabaseClient';
import { useSession } from '../useSession';
import toast from 'react-hot-toast';

function BookmarkButton({ resourceId }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();  const navigate = useNavigate();

  const checkBookmarkStatus = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('resource_bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('resource_id', resourceId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking bookmark status:', error.message);
    }

    setIsBookmarked(!!data);
    setLoading(false);
  }, [resourceId, session]);

  useEffect(() => {
    checkBookmarkStatus();
  }, [checkBookmarkStatus]);

  async function toggleBookmark() {
    if (session === undefined) return; // session still loading
    if (!session) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    // 🔍 Debug: Log Supabase session user ID
    const { data: sessionData} = await supabase.auth.getSession();
    ("Supabase auth session user ID:", sessionData?.session?.user?.id);

    if (isBookmarked) {
      // 🔻 Remove bookmark
      const { error } = await supabase
        .from('resource_bookmarks')
        .delete()
        .eq('user_id', session.user.id)
        .eq('resource_id', resourceId);

      if (error) {
        console.error('Supabase delete error:', error);
        toast.error('Failed to remove bookmark.');
      } else {
        setIsBookmarked(false);
        toast.success('Bookmark removed.');
      }
    } else {
      // ✅ Add bookmark
      ('Trying to insert:', {
        user_id: session.user.id,
        resource_id: resourceId
      });

      const { error } = await supabase
        .from('resource_bookmarks')
        .insert([{ user_id: session.user.id, resource_id: resourceId }]);

      if (error) {
        console.error('Supabase insert error:', error);
        toast.error('Failed to add bookmark.');
      } else {
        setIsBookmarked(true);
        toast.success('Bookmarked!');
      }
    }

    setLoading(false);
  }


  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`flex items-center ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={isBookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <span className="ml-1">
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </button>
  );
}

export default BookmarkButton;
