import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Filter } from 'lucide-react';

export default function RegulatoryClarity() {
  const [regulations, setRegulations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch regulations data
  const fetchRegulations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('regulations')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error(error);
      setError('Failed to load regulations. Please try again later.');
      setRegulations([]);
    } else {
      setRegulations(data || []);
    }

    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchRegulations();
  }, [fetchRegulations]);

  // Filtered regulations based on selected status
  const filtered = selectedStatus === 'All'
    ? regulations
    : regulations.filter(
        (r) =>
          r.status?.trim().toLowerCase() === selectedStatus.trim().toLowerCase()
      );

  // Styling helpers
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

  return (
    <div className="page-container bg-muted">
      <div className="container">
        {/* Header */}
        <header className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="page-title text-center">Global Stablecoin Regulation Tracker</h1>
          <div className="flex items-center gap-2 ">
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
        </header>

        {/* Main Content */}
        <main className="mb-12">
          {loading ? (
            <div className="loading-container">
              <div className="loading-dot bg-accent animate-ping" />
            </div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-subtle">No regulations found for the selected filter.</p>
          ) : (
        <div className="border-l-2 border-blue-200 pl-4 space-y-6">
               {filtered.map((item) => (
                <article key={item.id} className="relative ml-2 pl-4 card">
                  <div className="absolute left-[-20px] top-2 w-3 h-3 bg-blue-500 rounded-full"></div>

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
                    Date:{' '}
                    {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown'}
                  </footer>
                </article>
              ))}
            </div>
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
