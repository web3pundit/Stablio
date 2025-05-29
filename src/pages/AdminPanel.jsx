import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/hooks/useAdmin';
import { supabase } from '../contexts/lib/SupabaseClient';

function AdminPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        navigate('/');
      } else {
        fetchSubmissions();
      }
    }
  }, [adminLoading, isAdmin, navigate]);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'pending');

      if (error) throw error;
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(submission) {
    if (!submission) return;

    try {
      const { error: resourceError } = await supabase.from('resources').insert({
        title: submission.title,
        url: submission.url,
        description: submission.description,
        type: submission.type,
        topics: submission.topics,
        audience: submission.audience,
      });

      if (resourceError) throw resourceError;

      const { error: statusError } = await supabase
        .from('submissions')
        .update({ status: 'approved' })
        .eq('id', submission.id);

      if (statusError) throw statusError;

      fetchSubmissions();
    } catch (error) {
      alert('Error approving submission: ' + error.message);
    }
  }

  async function handleReject(submissionId) {
    if (!submissionId) return;

    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId);

      if (error) throw error;

      fetchSubmissions();
    } catch (error) {
      alert('Error rejecting submission: ' + error.message);
    }
  }

  // Show nothing until admin check finishes
  if (adminLoading) {
    return <div className="text-center p-10 text-muted">Checking admin status...</div>;
  }

  // This will be handled by useEffect's redirect
  if (!isAdmin) return null;

  return (
    <div className="container">
      <h1 className="page-title">Admin Panel</h1>
      <h2 className="section-title">Pending Submissions</h2>

      {loading ? (
        <div className="text-muted">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-muted">No pending submissions.</div>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="card">
              <h3 className="text-lg font-bold">{submission.title}</h3>
              <p className="text-sm text-muted mb-2">
                {submission.type} • {submission.audience}
              </p>
              <p className="mb-2">{submission.description}</p>
              <a
                href={submission.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link block mb-2"
              >
                {submission.url}
              </a>

              <div className="flex flex-wrap gap-2 mb-4">
                {submission.topics?.map((topic) => (
                  <span key={topic} className="tag">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleApprove(submission)} className="btn-success">
                  Approve
                </button>
                <button onClick={() => handleReject(submission.id)} className="btn-danger">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
