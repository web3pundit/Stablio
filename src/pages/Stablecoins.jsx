import { useEffect, useState, useCallback } from 'react';
import StablecoinCard from '../assets/components/StablecoinCard';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Helmet } from 'react-helmet';


export default function Stablecoins() {
  const PAGE_SIZE = 9;

  const [stablecoins, setStablecoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchStablecoins = useCallback(async (pageToFetch = 1, reset = false) => {
    setLoading(true);
    const from = (pageToFetch - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('stablecoins')
      .select('*')
      .order('created_at', { ascending: false });

    if (typeFilter !== 'all') {
      query = query.eq('type', typeFilter);
    }

    if (searchQuery) {
      const keyword = `%${searchQuery}%`;
      query = query.or(`name.ilike.${keyword},description.ilike.${keyword}`);
    }

    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
    } else {
      if (reset || pageToFetch === 1) {
        setStablecoins(data);
      } else {
        setStablecoins((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
    }

    setLoading(false);
  }, [PAGE_SIZE, typeFilter, searchQuery]);

  // Initial fetch and on filter/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchStablecoins(1, true);
  }, [typeFilter, searchQuery, fetchStablecoins]);

  // Load more pages
  useEffect(() => {
    if (page > 1) {
      fetchStablecoins(page);
    }
  }, [page, fetchStablecoins]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Helper for displaying arrays as comma-separated


  return (
    <div className="page-container bg-muted">
      <Helmet>
  <title>Stablecoins | Stablio</title>
  <meta name="description" content="Browse and compare stablecoins by type and backing. Find trusted, up-to-date information on leading crypto stablecoins." />
</Helmet>
      <div className="container">
        <h1 className="page-title text-center text-3xl font-bold mb-2">
          Explore and Compare Stablecoins
        </h1>
        <p className="text-center text-base !text-gray-700 max-w-2xl mx-auto mb-6">
          Browse a curated directory of stablecoins. Filter by type or search to find trusted, up-to-date information—whether you’re a user, builder, or analyst.
        </p>
        {/* Search */}
        <div className="flex justify-center mb-6 gap-2">
          <input
            type="text"
            placeholder="Search stablecoins..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input max-w-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        {/* Filters */}
        <div className="filter-group mb-6">
          <label className="label-sm">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="select"
          >
            <option value="all">All</option>
            <option value="Commodity-Backed">Commodity-Backed</option>
            <option value="Crypto-Backed">Crypto-Backed</option>
            <option value="Fiat-Backed">Fiat-Backed</option>
            <option value="Algorithmic">Algorithmic</option>
            <option value="Yield-Bearing">Yield-Bearing</option>
          </select>
        </div>
        {/* Cards */}
        {loading && page === 1 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12 min-h-[500px]">
            <div className="col-span-full flex justify-center items-center">
              <div className="loading-dot bg-accent animate-ping w-4 h-4 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12 min-h-[500px]">
            {stablecoins.length > 0 ? (
              stablecoins.map((coin) => (
                <StablecoinCard key={coin.id} coin={coin} />
              ))
            ) : (
              <p className="text-center col-span-full text-subtle">
                No stablecoins match your search or filter.
              </p>
            )}
          </div>
        )}
        {/* Load More */}
        {hasMore && stablecoins.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      {/* Disclaimer */}
      <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto">
        <p>
          <strong>Disclaimer:</strong> This directory is for informational purposes only. Always verify details before making financial decisions or interacting with any stablecoin.
        </p>
        <p className="mt-4 font-semibold text-gray-700">
          Trusted Knowledge. Built for the Stablecoin Community.
        </p>
      </div>
    </div>
  );
}