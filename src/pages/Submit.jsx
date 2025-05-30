import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/lib/SupabaseClient';
import { useSession } from '../contexts/useSession';
import toast from 'react-hot-toast';

function SubmitPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    type: 'article',
    audience: 'both',
    topics: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error('Please log in to submit a resource.');
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('resource_submissions')
      .insert({
        user_id: session.user.id,
        title: formData.title,
        url: formData.url,
        description: formData.description,
        type: formData.type,
        target_audience: formData.audience,
        topics: formData.topics,
        status: 'pending'
      });

    if (error) {
      toast.error('Error submitting resource: ' + error.message);
    } else {
      toast.success('Resource submitted for review!');
      navigate('/resources');
    }
  };

  return (
    <div className="page-container bg-gray-50 min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="page-title text-center mb-2 text-3xl font-bold">Submit a Resource</h1>
          <p className="text-center text-gray-500">
            Share an article, tool, or resource with the Stablecoin community.
          </p>
        </header>

        {/* White space between header and body */}
        <div className="h-8" />

        {/* Body */}
        <main className="mb-8 pb-6 border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="tool">Tool</option>
                <option value="documentation">Documentation</option>
                <option value="community">Community</option>
                <option value="research">Research</option>
                <option value="podcast">Podcast</option>
                <option value="blockchain">Blockchain</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">Target Audience</label>
              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Users</option>
                <option value="developer">Developers</option>
                <option value="both">Both</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Resource
            </button>
          </form>
        </main>

        {/* White space between body and footer */}
        <div className="h-8" />

        {/* Footer */}
        <footer className="mt-8">
          <div className="text-xs text-center text-gray-500">
            <p>
              <strong>Disclaimer:</strong> Submissions are reviewed before being published. Please ensure your resource is relevant and appropriate for the Stablecoin community.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SubmitPage;