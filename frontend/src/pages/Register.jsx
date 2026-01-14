import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Public Header (Copied from LandingPage) */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <img src={logo} alt="SmartCity Logo" className="h-8 w-auto" />
                </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm hidden sm:inline">Already have an account?</span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-900 font-medium text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        <div className="w-full max-w-md">
            {/* Back to Home Link */}
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to home
            </Link>

            {/* Register Card */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-blue-200 shadow-lg">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 text-sm">Join the community and start reporting</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                                placeholder="Create a password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Must be at least 8 characters long
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <p className="text-center mt-8 text-xs text-gray-400">
                © 2024 SmartCity. All rights reserved.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
