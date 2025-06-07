import { useEffect, useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Helmet } from 'react-helmet';
const PAGE_SIZE = 9;

export default function Jobs() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = async (pageToFetch = 1, reset = false) => {
    setLoading(true);
    const from = (pageToFetch - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // Include thumbnail in select
    const { data, error } = await supabase
      .from('jobs')
      .select('project_name, description, careers_url, tags, thumbnail')
      .order('project_name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      if (reset || pageToFetch === 1) {
        setProjects(data);
      } else {
        setProjects((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobs(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchJobs(page);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  
  return (
    <div className="page-container bg-muted px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Job Opportunity By Stablecoin Projects | Stablio</title>
        <meta name="description" content="Browse stablecoin job opportunities from top projects and companies. Find open roles in development, research, compliance, and more—curated for the stablecoin community." />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="page-title text-center mb-6">Explore Stablecoin Job Opportunities</h1>

        <p className="text-center text-base text-gray-700 max-w-2xl mx-auto mb-8">
          Browse open roles at leading stablecoin projects and companies. Find your next opportunity in development, research, compliance, community, and more.
        </p>

        {loading && page === 1 ? (
          <div className="loading-container flex justify-center my-8">
            <div className="loading-dot bg-accent animate-ping w-4 h-4 rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={`${project.project_name}-${index}`} className="card flex flex-col justify-between p-4 rounded-lg shadow-sm bg-white">
                  <div>
                    <img
                      src={project.thumbnail}
                      alt={project.project_name || "Project Thumbnail"}
                      className="w-full h-36 object-cover rounded-t-xl mb-2 hover:scale-105"
                    />
                    <h2 className="text-xl font-semibold mb-1">{project.project_name}</h2>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={project.careers_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-block text-center mt-auto"
                  >
                    Visit Careers Page
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No job portals available yet.</p>
            )}
          </div>
        )}

        {hasMore && projects.length > 0 && (
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

      <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto px-4">
        <p>
          <strong>Disclaimer:</strong> These listings are aggregated from public sources and official career pages. We do not guarantee the accuracy or availability of specific opportunities. Always verify on the project’s official site.
        </p>
      </div>
    </div>
  );
}