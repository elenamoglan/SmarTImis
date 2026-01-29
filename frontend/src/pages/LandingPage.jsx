import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, FileText, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <img src={logo} alt="SmartCity Logo" className="h-8 w-auto" />
                </div>
                <span className="text-xl font-bold text-gray-900">SmarTimis</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Sign In
              </Link>
              <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-900 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden hero-gradient text-white min-h-[600px] flex items-center">
          {/* SVG Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
                Building a Better City,
                <br />
                <span className="text-blue-200">Together</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Report infrastructure issues, track their resolution, and help make your community safer and more livable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {user ? (
                    <>
                      <button
                          onClick={() => navigate('/report')}
                          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-blue-900 bg-white hover:bg-gray-50 transition-colors shadow-lg"
                      >
                        Report an Issue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                      <button
                          onClick={() => navigate('/dashboard')}
                          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                      >
                        View Issue Map
                      </button>
                    </>
                ) : (
                    <>
                      <button
                          onClick={() => navigate('/register')}
                          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-blue-900 bg-white hover:bg-gray-50 transition-colors shadow-lg"
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                      <button
                          onClick={() => navigate('/login')}
                          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                      >
                        Sign In
                      </button>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Empowering citizens to improve their neighborhoods through easy-to-use reporting tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Location-Based Reporting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Pin exact locations on an interactive map to help city workers find and fix issues quickly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Issue Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload photos and descriptions. Track your reports from submission to resolution.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Transparent</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your reports are handled securely with full transparency on status updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Join thousands of engaged citizens who are helping build better communities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mb-10 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-teal-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-teal-500" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-teal-500" />
                <span>Real impact</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <img src={logo} alt="SmartCity Logo" className="h-6 w-auto" />
              </div>
              <span className="font-bold text-gray-800">SmarTimis</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 SmartCity. Building better communities together.
            </p>
          </div>
        </footer>
      </div>
  );
};

export default LandingPage;
