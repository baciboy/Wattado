import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + '/'
        }
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Check if email confirmation is required
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        // User already exists
        setError('An account with this email already exists. Please log in instead.');
        return;
      }

      if (data?.user && !data.session) {
        // Email confirmation required
        setSuccess('Account created! Please check your email to verify your account before logging in.');
      } else {
        // Auto-login successful (no email confirmation required)
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Create your account</h1>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !!success}
            className="w-full py-2 mt-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        {!success && (
          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account?</span>
            <a href="/login" className="ml-2 text-blue-700 font-semibold hover:underline">Log in</a>
          </div>
        )}
        {success && (
          <div className="text-center mt-4">
            <a href="/login" className="text-blue-700 font-semibold hover:underline">Go to login →</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;


