import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-dark to-navy-dark flex flex-col items-center justify-center px-4 text-center">
      {/* Hero Section */}
      <div className="space-y-6 mb-12">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">FitFlow</h1>
          <p className="text-cyan text-lg font-semibold">Premium Fitness at Your Fingertips</p>
        </div>

        <p className="text-gray-400 text-lg max-w-md">
          Book classes with credits, connect with top instructors, and transform your fitness journey.
        </p>
      </div>

      {/* Hero Feature Cards */}
      <div className="w-full max-w-md space-y-4 mb-12">
        <div className="bg-navy-light rounded-2xl p-4 border border-cyan border-opacity-30">
          <p className="text-lg font-semibold text-white">💳 Credit-Based</p>
          <p className="text-sm text-gray-400 mt-1">Buy credits once, book unlimited classes</p>
        </div>
        <div className="bg-navy-light rounded-2xl p-4 border border-cyan border-opacity-30">
          <p className="text-lg font-semibold text-white">🏋️ Expert Trainers</p>
          <p className="text-sm text-gray-400 mt-1">Learn from certified fitness professionals</p>
        </div>
        <div className="bg-navy-light rounded-2xl p-4 border border-cyan border-opacity-30">
          <p className="text-lg font-semibold text-white">📱 Mobile First</p>
          <p className="text-sm text-gray-400 mt-1">Book and manage classes on the go</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-cyan text-navy-dark font-bold py-4 rounded-xl hover:bg-cyan-light transition-colors flex items-center justify-center gap-2"
        >
          Get Started <ArrowRight size={20} />
        </button>
        <button
          onClick={() => navigate('/browse')}
          className="w-full bg-navy-light text-white font-bold py-4 rounded-xl border border-cyan border-opacity-30 hover:border-opacity-60 transition-colors"
        >
          Browse Classes
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-12">Join 10k+ fitness enthusiasts already transforming</p>
    </div>
  );
}
