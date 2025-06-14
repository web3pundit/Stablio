import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Helmet } from 'react-helmet';

export default function Home() {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const [{ data: recentResources }, { data: upcomingEvents }] = await Promise.all([
        supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('events').select('*').order('date', { ascending: true }).limit(10),
      ]);
      setResources(recentResources || []);
      setEvents(upcomingEvents || []);
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <span className="h-5 w-5 rounded-full bg-blue-500 animate-ping mb-2"></span>
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcomingEventsOnly = events.filter(evt => new Date(evt.date) >= now);

  return (
    <main className="bg-white min-h-screen">
      <Helmet>
        <title>Welcome To Stablio | Stablio</title>
        <meta name="description" content="Curated stablecoin insights, resources, regulations, and events—trusted by builders, researchers, and policymakers. Stay informed and build with confidence, all in one place." />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 sm:py-24 mb-16">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
            Curated Stablecoin Insights for Builders, Researchers, and Policymakers
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-10 font-medium">
            Stablio brings together the most relevant resources, regulations, and events in the stablecoin ecosystem — all in one place. Save time, stay informed, and build with clarity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/resources" className="btn-primary text-lg px-8 py-3 rounded-full shadow hover:shadow-lg transition font-semibold">
              Explore Stablecoin Resources
            </Link>
            <Link to="/regulatory" className="btn-primary text-lg px-8 py-3 rounded-full shadow hover:shadow-lg transition font-semibold bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
              Track Global Regulation
            </Link>
          </div>
        </div>
      </section>

      {/* Why Use Stablio */}
      <section className="max-w-4xl mx-auto mb-24 px-4 sm:px-6">
        <div className="bg-blue-50 rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Why Use Stablio?</h2>
          <ul className="space-y-6 text-base sm:text-lg text-gray-800 list-disc pl-6 sm:pl-8">
            <li>
              <span className="font-semibold text-blue-800">Skip the Noise:</span> No more digging through scattered blog posts or outdated PDFs — every resource is handpicked and regularly updated.
            </li>
            <li>
              <span className="font-semibold text-blue-800">For Every Stakeholder:</span> Whether you're a developer, policymaker, or investor, Stablio helps you find exactly what you need — fast.
            </li>
            <li>
              <span className="font-semibold text-blue-800">Global and Current:</span> Track regulatory updates and events worldwide, not just from one region or sector.
            </li>
            <li>
              <span className="font-semibold text-blue-800">Built on Trust:</span> We source directly from official docs, expert podcasts, and credible research.
            </li>
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <hr className="border-gray-200" />
      </div>

      {/* Recent Resources */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Resources</h2>
          <Link to="/resources" className="text-blue-600 hover:underline font-medium">View More →</Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 sm:gap-6">
            {resources.length === 0 ? (
              <p className="text-gray-400">No resources found.</p>
            ) : (
              resources.map((res) => (
                <a
                  key={res.id}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[250px] max-w-[300px] bg-white hover:shadow-xl shadow-md rounded-xl transition-shadow duration-300 border border-gray-100 flex-shrink-0"
                >
                  <img
                    src={res.thumbnail}
                    alt={res.title}
                    className="w-full h-36 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{res.title}</h3>
                    <p className="text-sm text-blue-700 line-clamp-2 mb-1">
                      {res.type} • {res.audience}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-3">{res.description}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <hr className="border-gray-200" />
      </div>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="text-blue-600 hover:underline font-medium">View All Events →</Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 sm:gap-6">
            {upcomingEventsOnly.length === 0 ? (
              <p className="text-gray-400">No upcoming events.</p>
            ) : (
              upcomingEventsOnly.map((evt) => (
                <a
                  key={evt.id}
                  href={evt.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[250px] max-w-[300px] bg-white hover:shadow-xl shadow-md rounded-xl transition-shadow duration-300 border border-gray-100 flex-shrink-0"
                >
                  <img
                    src={evt.thumbnail}
                    alt={evt.title || "Event Thumbnail"}
                    className="w-full h-36 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{evt.title}</h3>
                    <p className="text-blue-700 text-sm mb-1">{new Date(evt.date).toLocaleDateString()}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
