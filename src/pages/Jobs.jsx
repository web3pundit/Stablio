import { useEffect, useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';

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

    const { data, error } = await supabase
      .from('jobs')
      .select('project_name, description, careers_url, tags')
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
    <div className="page-container bg-muted">
      <div className="container">
        <h1 className="page-title text-center">Job Opportunities</h1>

        {loading && page === 1 ? (
          <div className="loading-container">
            <div className="loading-dot bg-accent animate-ping" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={`${project.project_name}-${index}`} className="card flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{project.project_name}</h2>
                    <p className="text-subtle mb-2">{project.description}</p>
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
              <p className="text-center col-span-full text-subtle">No job portals available yet.</p>
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

      <div className="mt-12 text-xs text-center text-gray-500 max-w-3xl mx-auto">
        <p>
          <strong>Disclaimer:</strong> These listings are aggregated from public sources and official career pages. We do not guarantee the accuracy or availability of specific opportunities. Always verify on the project’s official site.
        </p>
      </div>
    </div>
  );
}
