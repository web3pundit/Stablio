import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/lib/SupabaseClient';
import { Toaster, toast } from 'react-hot-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleAuth(type) {
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      let error = null;

      if (type === 'LOGIN') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = loginError;
      } else {
        const { error: signupError } = await supabase.auth.signUp({
          email,
          password,
        });
        error = signupError;
      }

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(type === 'LOGIN' ? 'Logged in successfully!' : 'Signup successful!');

        // Check if the user is an admin
        const { data: { user } } = await supabase.auth.getUser();
        const adminEmails = ['stinloop@gmail.com']; // Case insensitive match

        if (user && adminEmails.includes(user.email?.toLowerCase())) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" />
      <div className="card max-w-md w-full">
        <h2 className="page-title text-center">Login / Signup</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-6"
          disabled={loading}
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleAuth('LOGIN')}
            className={`btn-primary w-full ${loading ? 'bg-blue-300 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            onClick={() => handleAuth('SIGNUP')}
            className={`btn-success w-full ${loading ? 'bg-green-300 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </div>
      </div>
    </div>
  );
}
