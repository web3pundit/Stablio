import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';

export default function StablecoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      const { data, error } = await supabase
        .from('stablecoins')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setCoin(data);

      setLoading(false);
    };

    fetchCoin();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-dot bg-accent animate-ping" />
    </div>
  );

  if (!coin) return <div className="text-center mt-10 text-muted">Stablecoin not found.</div>;

  return (
    <div className="container">
      <Link to="/stablecoins" className="btn-primary mb-6 inline-block">
        &larr; Back to All Stablecoins
      </Link>

      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <img
          src={coin.logo || '/default-logo.png'}
          alt={coin.name}
          className="w-24 h-24 object-contain rounded shadow"
        />
        <div className="flex-1">
          <h1 className="page-title">{coin.name}</h1>
        </div>
      </div>

      <div className="space-y-6">
        <section>
  <h2 className="section-title">Founder</h2>
  <p>{coin.CEO || 'Not provided'}</p>
  {coin.x_accounts ? (
    <div className="mt-2">
      <a
        href={coin.x_accounts}
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        X Profile ↗
      </a>
    </div>
  ) : (
    <p className="text-muted">No X profile listed</p>
  )}
</section>


<section className="card">
  <h2 className="section-title">Use Case</h2>
  {Array.isArray(coin.use_case) && coin.use_case.length > 0 ? (
    <ul className="list-disc list-inside space-y-1">
      {coin.use_case.map((use, i) => (
        <li key={i} className="text-muted">{use}</li>
      ))}
    </ul>
  ) : (
    <p className="text-muted">Use case not provided.</p>
  )}
</section>


        <section className="card">
          <h2 className="section-title">Official Website</h2>
          {coin.official_link ? (
            <a href={coin.official_link} target="_blank" rel="noopener noreferrer" className="link">
              {coin.official_link} ↗
            </a>
          ) : (
            <p className="text-muted">No official site listed.</p>
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Supported Blockchains</h2>
          {coin.chains?.length > 0 ? (
            <ul className="list-disc list-inside text-muted">
              {coin.chains.map((chain, i) => (
                <li key={i}>{chain}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No chains currently listed.</p>
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Regulatory Compliance</h2>
          <p>{coin.compliance || 'Compliance details not provided.'}</p>
        </section>

        <section className="card">
          <h2 className="section-title">Reserves</h2>
          <p>{coin.reserves || 'Reserves information not available.'}</p>
        </section>

        <section className="card">
  <h2 className="section-title">Audits</h2>
  {coin.audit_links ? (
    <div>
      <a
        href={coin.audit_links}
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        View Audit ↗
      </a>
    </div>
  ) : (
    <p className="text-muted">
      This stablecoin has not published any third-party audits yet.
    </p>
  )}
</section>

      </div>
    </div>
  );
}
