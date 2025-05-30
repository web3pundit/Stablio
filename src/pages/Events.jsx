import { useEffect, useState, useRef } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Filter } from 'lucide-react';

const PAGE_SIZE = 9;
const FILTER_OPTIONS = ['All', 'Conference', 'Summit', 'Festival', 'X space'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const seenIds = useRef(new Set());

  const fetchEvents = async (pageNum, filter = 'All') => {
    setLoading(true);
    setError(null);

    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .range(from, to);

      if (filter !== 'All') {
        query = query.ilike('type', `%${filter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const newEvents = (data || []).filter((event) => {
        if (pageNum === 0) {
          seenIds.current = new Set();
        }
        if (seenIds.current.has(event.id)) return false;
        seenIds.current.add(event.id);
        return true;
      });

      setEvents((prev) => (pageNum === 0 ? newEvents : [...prev, ...newEvents]));
      setPage(pageNum + 1);
      setHasMore(data && data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(0, typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    fetchEvents(0, typeFilter);
  }, [typeFilter]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchEvents(page, typeFilter);
    }
  };

  return (
    <div className="page-container bg-muted px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="page-title text-center mb-8">Upcoming Events</h1>

        <div className="flex items-center gap-2 mb-6">
          <Filter size={18} />
          <select
            className="select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {loading && events.length === 0 ? (
          <div className="loading-container flex justify-center my-8">
            <div className="loading-dot bg-accent animate-ping w-4 h-4 rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="card flex flex-col justify-between p-4 rounded-lg shadow-sm bg-white">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <span className="tag mb-2 inline-block">{event.type}</span>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link mt-3 inline-block"
                  >
                    View Details
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No events found for the selected type.
              </p>
            )}
          </div>
        )}

        {hasMore && events.length > 0 && !error && (
          <div className="text-center mt-8">
            <button onClick={loadMore} disabled={loading} className="btn btn-primary">
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto px-4">
          <p>
            <strong>Disclaimer:</strong> The events listed on this page are curated from publicly
            available sources. While we strive for accuracy, dates, locations, and details are
            subject to change. Always verify event information with the official organizer before
            making travel or registration plans.
          </p>
        </div>
      </main>
    </div>
  );
}