import { useEffect, useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import ExpertCard from '../assets/components/ExpertCard';
import { Helmet } from 'react-helmet';

export default function Experts() {
  const PAGE_SIZE = 9;

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchExperts() {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('experts')
        .select(`
          id,
          name,
          role,
          avatar,
          profile_link
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching experts:', error);
      } else if (data) {
        setExperts(prev => {
          const uniqueMap = new Map();
          [...prev, ...data].forEach(expert => uniqueMap.set(expert.id, expert));
          return Array.from(uniqueMap.values());
        });

        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }

      setLoading(false);
    }

    fetchExperts();
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="container">
      <Helmet>
  <title>Stablecoin Industry Leaders | Stablio</title>
  <meta
    name="description"
    content="Browse a curated directory of stablecoin Indeustry Leaders Twitter/X Acounts. Find researchers, developers, and analysts to follow or contact for insights and collaboration."
  />
</Helmet>
      <>
        <h1 className="page-title text-center text-3xl font-bold mb-2">
          Discover Leading Stablecoin Industry Leaders.
        </h1>
        <p className="text-center text-base text-gray-700 max-w-2xl mx-auto mb-6">
          Find and connect with trusted voices in the stablecoin ecosystem. Filter by specialty or search for experts to get insights, advice, or collaboration.
        </p>

        <div className="flex justify-center mb-8">
          <a
            href="#main-content"
            className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Find Who To Follow
          </a>
        </div>

        <div id="main-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {experts.map(expert => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-dot bg-accent animate-ping" />
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center">
            <button onClick={handleLoadMore} className="btn btn-primary">
              Load More
            </button>
          </div>
        )}

        <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> This directory is curated for informational purposes. The idivndividuals featured are included based on their public activity related to stablecoins. Roles assigned are observational and do not represent formal affiliations, endorsements, or professional validation. Always verify credentials independently before engaging with any expert.
          </p>

        </div>
      </>
    </div>
  );
}