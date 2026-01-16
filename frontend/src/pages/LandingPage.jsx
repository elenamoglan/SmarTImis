import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, FileText, Shield, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <img src={logo} alt="SmartCity Logo" className="h-8 w-auto" />
              </div>
              <span className="font-bold text-xl text-gray-900">SmarTimis</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center"
        style={{ background: 'linear-gradient(135deg, #13386c, #24748f)' }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Building better <br/>
            <span className="text-blue-200">communities together.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Report issues, track progress, and collaborate with local authorities to improve your neighborhood. Join the SmartCity initiative today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-blue-400"
            >
              Report an Issue
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/30 transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>
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
                © 2024 SmarTimis. Building better communities together.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
