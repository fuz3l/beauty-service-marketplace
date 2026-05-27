import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Reusing PublicNavbar for consistency if not logged in, but wait, it might be better to just have a simple nav */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-500 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <Sparkles className="w-6 h-6" />
            <span>GlamBook</span>
          </div>
          <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-rose-500 font-medium flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">How GlamBook Works</h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Your journey to premium beauty services in three simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-extrabold text-3xl mb-8 shadow-sm">
              1
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Discover Artists</h3>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Browse through our curated list of verified makeup artists, hair stylists, and beauty professionals near you. View their portfolios, read reviews, and find the perfect match for your needs.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-extrabold text-3xl mb-8 shadow-sm">
              2
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Book Instantly</h3>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Select your preferred service, choose a date and time that works for you, and send a booking request. Confirm your booking instantly with secure payment options.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-extrabold text-3xl mb-8 shadow-sm">
              3
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Get Glamorous</h3>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Sit back and relax. Your chosen beauty professional will arrive at the scheduled time, fully equipped and ready to provide a premium, personalized beauty experience.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center bg-rose-500 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-3xl font-bold mb-6 relative z-10">Ready to transform your look?</h2>
          <Link to="/browse" className="inline-block bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-50 hover:scale-105 transition-all shadow-md relative z-10">
            Find an Artist Now
          </Link>
        </div>
      </main>
    </div>
  );
}
