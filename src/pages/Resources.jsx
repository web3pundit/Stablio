import { useEffect, useState, useCallback } from 'react';
import ResourceCard from '../contexts/lib/ResourceCard';
import { supabase } from '../contexts/lib/SupabaseClient';

export default function Resources() {
  const PAGE_SIZE = 9;

  const [resources, setResources] = useState([]);
  const [allResults, setAllResults] = useState([]); // for Discover mode
  const [loading, setLoading] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortMode, setSortMode] = useState('latest'); // 'latest' or 'discover'

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fetchResources = useCallback(async (pageToFetch = 1, reset = false) => {
    setLoading(true);

    let query = supabase.from('resources').select('*');

    if (audienceFilter !== 'all') {
      query = query.eq('audience', audienceFilter);
    }

    if (typeFilter !== 'all') {
      query = query.eq('type', typeFilter);
    }

    if (searchQuery) {
      const keyword = `%${searchQuery}%`;
      query = query.or(`title.ilike.${keyword},description.ilike.${keyword}`);
    }

    if (sortMode === 'latest') {
      // Paginate from server
      const from = (pageToFetch - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Fetch error:', error);
      } else {
        if (reset || pageToFetch === 1) {
          setResources(data);
        } else {
          setResources((prev) =>
            Array.from(new Map([...prev, ...data].map((item) => [item.id, item])).values())
          );
        }
        setHasMore(data.length === PAGE_SIZE);
      }
    } else {
      // Discover mode — fetch once, shuffle client-side
      query = query.limit(200); // Reasonable upper bound
      const { data, error } = await query;

      if (error) {
        console.error('Fetch error:', error);
      } else {
        const shuffled = shuffleArray(data);
        setAllResults(shuffled);
        setResources(shuffled.slice(0, PAGE_SIZE));
        setHasMore(shuffled.length > PAGE_SIZE);
        setPage(1);
      }
    }

    setLoading(false);
  }, [audienceFilter, typeFilter, searchQuery, sortMode]);

  // Re-fetch on filters/sort change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setResources([]);
    setAllResults([]);
    fetchResources(1, true);
  }, [audienceFilter, typeFilter, searchQuery, sortMode, fetchResources]);

  // Load more for client-shuffled Discover mode
  useEffect(() => {
    if (sortMode === 'discover' && page > 1) {
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const nextPage = allResults.slice(start, end);
      setResources((prev) => [...prev, ...nextPage]);
      setHasMore(end < allResults.length);
    } else if (sortMode === 'latest' && page > 1) {
      fetchResources(page);
    }
  }, [page, sortMode, allResults, fetchResources]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Stablecoin Resources</h1>

        {/* Toggle: Latest vs Discover */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setSortMode('latest')}
            className={`px-4 py-2 rounded shadow ${sortMode === 'latest' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortMode('discover')}
            className={`px-4 py-2 rounded shadow ${sortMode === 'discover' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}
          >
            Discover
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full max-w-md p-2 border rounded bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Audience:</label>
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="p-2 border rounded bg-white text-gray-800"
            >
              <option value="all">All</option>
              <option value="Users">Users</option>
              <option value="Developers">Developers</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border rounded bg-white text-gray-800"
            >
              <option value="all">All</option>
              <option value="Article">Article</option>
              <option value="Video">Video</option>
              <option value="Tool">Tool</option>
              <option value="Documentation">Documentation</option>
              <option value="Research">Research</option>
              <option value="Podcast">Podcast</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Speech">Speech</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {resources.length > 0 ? (
              resources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-600">
                No resources found. Try adjusting filters or refining your search.
              </p>
            )}
          </div>
        )}

        {/* Load More */}
        {hasMore && resources.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> All resources curated here—including articles, videos, tools, documents, research, podcasts, and speeches—are sourced from third-party creators and platforms. 
            Copyright belongs to their respective owners. This platform simply aggregates them for informational and educational purposes.
          </p>
        </div>
      </div>
    </div>
  );
}