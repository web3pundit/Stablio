// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Stablio</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Link to="/resources">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-lg">
            Explore Resources
          </button>
        </Link>
        <Link to="/stablecoins">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 text-lg">
            Explore Stablecoins
          </button>
        </Link>
      </div>
    </div>
  );
}
