import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Filter } from 'lucide-react';
import { Helmet } from 'react-helmet';


export default function RegulatoryClarity() {
  const PAGE_SIZE = 9;

  const [regulations, setRegulations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRegulations = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('regulations')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      setError('Failed to load regulations. Please try again later.');
      if (reset) setRegulations([]);
    } else {
      if (reset) {
        setRegulations(data || []);
      } else {
        setRegulations(prev => [...prev, ...(data || [])]);
      }
      if (!data || data.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }

    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchRegulations(page === 1);
    // eslint-disable-next-line
  }, [page]);

  // Reset pagination when filter changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setRegulations([]);
    setError(null);
    setLoading(false);
    // Fetch first page for new filter
    fetchRegulations(true);
    // eslint-disable-next-line
  }, [selectedStatus]);

  const filtered = selectedStatus === 'All'
    ? regulations
    : regulations.filter(
        (r) =>
          r.status?.trim().toLowerCase() === selectedStatus.trim().toLowerCase()
      );

  const statusStyle = (status) => {
    switch (status?.trim()) {
      case 'Passed':
        return 'bg-green-100 text-green-700';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const scopeStyle = (scope) => {
    switch (scope?.toLowerCase()) {
      case 'dedicated':
        return 'bg-indigo-100 text-indigo-700';
      case 'explicit':
        return 'bg-emerald-100 text-emerald-700';
      case 'partial':
        return 'bg-amber-100 text-amber-800';
      case 'mentioned-only':
        return 'bg-slate-100 text-slate-700';
      case 'enabling/interim':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="page-container bg-muted">
      <Helmet>
  <title>Stablecoin Regulation Tracker | Stablio</title>
  <meta name="description" content="Track global stablecoin regulations in one place. Filter by country or status and stay updated on the latest laws, proposals, and compliance changes." />
</Helmet>
      <div className="container">
        {/* Header */}
             <header className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="page-title text-center text-3xl font-bold mb-2">
            Track Stablecoin Regulations Worldwide
          </h1>
          <p className="text-center text-base !text-gray-700 max-w-2xl mx-auto mb-4">
            Stay informed on the latest stablecoin laws, proposals, and policy updates from around the globe. 
            Filter by status to quickly find what matters to you.
          </p>
          
          <div className="flex flex-col items-center mt-2">
            <span className="text-xs text-gray-500">
              <strong>Why use this tracker?</strong>  
              <span className="ml-1">
                Get a curated, filterable snapshot of global stablecoin policy—no more endless searching or scattered news.
              </span>
            </span>
            <a
              href="#main-content"
              className="mt-3 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            >
              Explore Regulatory Updates
            </a>
          </div>
          <div className="flex items-start gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Filter size={18} />
              <select
                className="select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {['All', 'Passed', 'Under Review', 'Pending', 'Rejected'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="mb-12">
          {loading && page === 1 ? (
            <div className="border-l-2 border-blue-200 pl-4 space-y-6 min-h-[500px] flex items-center justify-center">
              <div className="loading-dot bg-accent animate-ping w-4 h-4 rounded-full" />
            </div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <div className="border-l-2 border-blue-200 pl-4 space-y-6 min-h-[500px] flex items-center justify-center">
              <p className="text-center text-subtle">No regulations found for the selected filter.</p>
            </div>
          ) : (
            <>
              <div className="border-l-2 border-blue-200 pl-4 space-y-6 min-h-[500px]">
                {filtered.map((item) => (
                  <article key={item.id} className="relative ml-2 pl-4 card">
                    <div className="absolute left-[-20px] top-2 w-3 h-3 bg-blue-500 rounded-full" />

                    <header className="flex justify-between items-center mb-1">
                      <h2 className="text-xl font-semibold">{item.country}</h2>
                      <span className={`text-sm px-3 py-1 rounded-full ${statusStyle(item.status)}`}>
                        {item.status || 'Unknown'}
                      </span>
                    </header>

                    <h3 className="text-subtle font-medium">{item.regulation}</h3>
                    <p className="text-muted mt-2">{item.summary || 'No summary available.'}</p>

                    <div className="flex gap-2 flex-wrap mt-3">
                      {item.scope && (
                        <span className={`tag px-2 py-1 rounded-full text-sm ${scopeStyle(item.scope)}`}>
                          {item.scope}
                        </span>
                      )}
                    </div>

                    <footer className="text-sm text-gray-500 mt-3">
                      Date: {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown'}
                    </footer>
                  </article>
                ))}
              </div>
              {hasMore && !loading && (
                <div className="text-center mt-6">
                  <button onClick={handleLoadMore} className="btn btn-primary">
                    Load More
                  </button>
                </div>
              )}
              {loading && page > 1 && (
                <div className="loading-container mt-4">
                  <div className="loading-dot bg-accent animate-ping w-4 h-4 rounded-full" />
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-6 text-xs text-center text-gray-500 max-w-3xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> This tracker summarizes stablecoin-related regulatory developments based on publicly available information.
            While we aim to reflect the latest updates accurately, this content does not constitute legal advice or official government positions.
            Always consult primary legal sources or qualified professionals before making decisions based on regulation-related content.
          </p>
          
        </footer>
      </div>
    </div>
  );
}