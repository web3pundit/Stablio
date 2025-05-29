import { Link } from 'react-router-dom';

export default function StablecoinCard({ coin }) {
  return (
    <div className="card flex flex-col items-center text-center">
      <img
        src={coin.logo || '/default-logo.png'}
        alt={coin.name}
        className="w-20 h-20 object-contain mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{coin.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{coin.description}</p>
      <span className="text-blue-600 text-sm mb-4 capitalize">{coin.type}</span>
      <Link
        to={`/stablecoins/${coin.id}`}
        className="btn-primary mt-auto"
      >
        Learn More →
      </Link>
    </div>
  );
}
