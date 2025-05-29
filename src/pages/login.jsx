import { useState } from 'react';
import { supabase } from '../contexts/lib/SupabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        console.error(error);
        alert(error.message || 'Something went wrong. Please try again.');
      } else {
        alert('Check your email for the login link!');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card max-w-md mx-auto mt-16">
      <h1 className="page-title text-center">Login</h1>

      <div className="mb-5">
        <label className="label" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSignIn}
        disabled={loading}
        className={`btn-primary w-full ${
          loading ? 'bg-blue-300 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </div>
  );
}

export default Login;
