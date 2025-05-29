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

  // Fetch events from supabase
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

      // Only reset seenIds on filter change or initial fetch
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

  // Only one initial fetch, always using the current filter
  useEffect(() => {
    fetchEvents(0, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch events when filter changes
  useEffect(() => {
    fetchEvents(0, typeFilter);
  }, [typeFilter]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchEvents(page, typeFilter);
    }
  };

  return (
    <div className="page-container bg-muted">
      <main className="container">
        <h1 className="page-title text-center mb-8">Upcoming Events</h1>

        {/* Filter dropdown */}
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

        {/* Error */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Loading */}
        {loading && events.length === 0 ? (
          <div className="loading-container flex justify-center">
            <div className="loading-dot bg-accent animate-ping" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="card flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <span className="tag mb-2 inline-block">{event.type}</span>
                    <p className="text-muted mb-1">
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
              <p className="text-center col-span-full text-subtle">
                No events found for the selected type.
              </p>
            )}
          </div>
        )}

        {/* Load More */}
        {hasMore && events.length > 0 && !error && (
          <div className="text-center mt-8">
            <button onClick={loadMore} disabled={loading} className="btn btn-primary">
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto">
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