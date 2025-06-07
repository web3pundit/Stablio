import { useEffect, useState, useRef } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Filter } from 'lucide-react';
import { Helmet } from 'react-helmet';

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
    const today = new Date().toISOString();

    try {
      let query = supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .range(from, to);

      if (filter !== 'All') {
        query = query.ilike('type', `%${filter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (pageNum === 0) seenIds.current = new Set();

      const newEvents = (data || []).filter((event) => {
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
    setEvents([]);
    setPage(0);
    setHasMore(true);
    fetchEvents(0, typeFilter);
  }, [typeFilter]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchEvents(page, typeFilter);
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const pastEvents = events.filter(e => new Date(e.date) < now);

  return (
    <div className="page-container bg-muted px-4 sm:px-6 lg:px-8">
      <Helmet>
    <title>Stablecoin Events | Stablio</title>
    <meta name="description" content="Find upcoming stablecoin events, conferences, and summits. Stay connected with the stablecoin community—browse, filter, and track key industry happenings in one place." />
</Helmet>


      <main className="max-w-7xl mx-auto">
        <h1 className="page-title text-center mb-8">
          Discover Stablecoin Events & Conferences
        </h1>

        <p className="text-center text-base text-gray-700 max-w-2xl mx-auto mb-6">
          Stay informed about the latest stablecoin events, summits, and online discussions. Filter by type or browse to find opportunities to learn, network, and connect with the community.
        </p>

        <div className="flex justify-center mb-8">
          <a
            href="#main-content"
            className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            See Upcoming Events
          </a>
        </div>

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

        {loading && upcomingEvents.length === 0 ? (
          <div className="loading-container flex justify-center my-8">
            <div className="loading-dot bg-accent animate-ping w-4 h-4 rounded-full" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="card flex flex-col justify-between p-4 rounded-lg shadow-sm bg-white">
                    <div>
                      <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-36 object-cover rounded-t-xl mb-2 hover:scale-105"
                  />
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
                  No upcoming events found.
                </p>
              )}
            </div>

            {pastEvents.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-center">Past Events</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-70 italic">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="card p-4 rounded-lg shadow-sm bg-white">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">{event.title}</h2>
                        <span className="tag mb-1 inline-block">{event.type}</span>
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(event.date).toLocaleDateString()} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {hasMore && upcomingEvents.length > 0 && !error && (
          <div className="text-center mt-8">
            <button onClick={loadMore} disabled={loading} className="btn btn-primary">
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto px-4">
          <p>
            <strong>Disclaimer:</strong> Event details are provided for informational purposes only. Please confirm event information with official sources before making plans or travel arrangements.
          </p>
          
        </div>
      </main>
    </div>
  );
}