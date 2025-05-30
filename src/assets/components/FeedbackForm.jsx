import { useState } from 'react';
import { supabase } from '../../contexts/lib/SupabaseClient';
import toast from 'react-hot-toast';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error('Please enter your feedback.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('feedback').insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error('Error submitting feedback.');
      console.error(error);
    } else {
      toast.success('Thanks for your feedback!');
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white p-4 rounded shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">We'd love your feedback</h2>
      <div className="grid gap-3">
        <input
          name="name"
          type="text"
          placeholder="Your name (optional)"
          value={formData.name}
          onChange={handleChange}
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Your email (optional)"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
        <textarea
          name="message"
          placeholder="Your feedback..."
          value={formData.message}
          onChange={handleChange}
          required
          className="input"
          rows={4}
        />
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}
