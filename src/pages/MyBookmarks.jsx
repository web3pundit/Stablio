import { useEffect, useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { useSession } from '../contexts/useSession';
import { Link, useNavigate } from 'react-router-dom';
import BookmarkButton from '../contexts/lib/BookmarkButton';

// Fisher-Yates shuffle for client-side randomization
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MyBookmarks() {
  const { session } = useSession();
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      navigate('/auth');
      return;
    }

    const fetchBookmarks = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const { data: bookmarkData, error } = await supabase
        .from('resource_bookmarks')
        .select('resource_id')
        .eq('user_id', session.user.id);

      if (error) {
        setLoading(false);
        return;
      }

      const resourceIds = bookmarkData.map((b) => b.resource_id);

      if (resourceIds.length === 0) {
        setBookmarkedResources([]);
        setLoading(false);
        return;
      }

      // Try random order from Supabase/Postgres
      let { data: resources, error: resError } = await supabase
        .from('resources')
        .select('id, title, description, link')
        .in('id', resourceIds)
        .order('RANDOM()'); // Postgres-specific

      // If order('RANDOM()') fails, fallback to client shuffle
      if (resError || !resources) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('resources')
          .select('id, title, description, link')
          .in('id', resourceIds);

        if (fallbackError) {
          setBookmarkedResources([]);
        } else {
          setBookmarkedResources(shuffleArray(fallbackData));
        }
      } else {
        setBookmarkedResources(resources);
      }

      setLoading(false);
    };

    fetchBookmarks();
  }, [session, navigate]);

  if (loading) return <div className="p-4">Loading your bookmarks...</div>;

  if (bookmarkedResources.length === 0) {
    return <div className="p-4">You have no bookmarks yet.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">My Bookmarked Resources</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {bookmarkedResources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 border rounded hover:bg-gray-50 relative flex flex-col h-full"
          >
            {/* Place BookmarkButton outside the Link to avoid overlap */}
            <div className="mb-2 flex justify-end">
              <BookmarkButton resourceId={resource.id} />
            </div>
            <Link
              to={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block flex-1 focus:outline-none"
              tabIndex={0}
            >
              <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
              <p className="text-gray-600">{resource.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}