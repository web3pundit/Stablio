import { useEffect, useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { useSession } from '../contexts/useSession';
import { Link, useNavigate } from 'react-router-dom';
import BookmarkButton from '../contexts/lib/BookmarkButton'; // adjust if located elsewhere

export default function MyBookmarks() {
  const { session } = useSession();
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (session === undefined) return; // Wait until session is loaded
    if (!session) {
      navigate('/auth');
      return;
    }
  
    const fetchBookmarks = async () => {
      if (!session?.user?.id) {
        console.warn('No valid session.user.id');
        setLoading(false);
        return;
      }
      
      const { data: bookmarkData, error } = await supabase
      .from('resource_bookmarks')
      .select('resource_id')
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error('Error fetching bookmarks:', error.message);
      setLoading(false);
      return;
    }
    
    const resourceIds = bookmarkData.map((b) => b.resource_id);
    
    const { data: resources, error: resError } = await supabase
      .from('resources')
      .select('id, title, description, link')
      .in('id', resourceIds);
    
    if (resError) {
      console.error('Error fetching resources:', resError.message);
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
      <h1 className="text-2xl font-bold mb-4">My Bookmarked Resources</h1>
      <div className="grid gap-4">
      {bookmarkedResources.map((resource) => (
  <div key={resource.id} className="p-4 border rounded hover:bg-gray-50 relative">
    <div className="absolute top-2 right-2">
      <BookmarkButton resourceId={resource.id} />
    </div>
    <Link
      to={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <h2 className="text-xl font-semibold">{resource.title}</h2>
      <p className="text-gray-600">{resource.description}</p>
    </Link>
  </div>
))}

      </div>
    </div>
  );
}
