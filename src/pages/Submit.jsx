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

  const handleTopicChange = (topic) => {
    const updatedTopics = formData.topics.includes(topic)
      ? formData.topics.filter(t => t !== topic)
      : [...formData.topics, topic];
    setFormData({ ...formData, topics: updatedTopics });
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
    <div className="flex justify-center px-4 py-10 text-gray-800 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Submit a Resource</h1>

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

          <div>
            <label className="block mb-2 font-semibold">Topics</label>
            <div className="grid grid-cols-2 gap-2">
              {["basics", "defi", "security", "development", "trading", "regulation"].map(topic => (
                <label key={topic} className="flex items-center text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.topics.includes(topic)}
                    onChange={() => handleTopicChange(topic)}
                    className="mr-2"
                  />
                  <span className="capitalize">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitPage;
