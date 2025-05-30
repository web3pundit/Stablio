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

        const { data: { user } } = await supabase.auth.getUser();
        const adminEmails = ['stinloop@gmail.com'];

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-white">
      <Toaster position="top-center" />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 space-y-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome</h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Login or sign up to continue
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={() => handleAuth('LOGIN')}
            className={`w-full px-4 py-2 rounded-lg text-white transition-all duration-200 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            onClick={() => handleAuth('SIGNUP')}
            className={`w-full px-4 py-2 rounded-lg text-white transition-all duration-200 ${
              loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </div>
      </div>
    </div>
  );
}
