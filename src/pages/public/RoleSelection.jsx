import { Link } from 'react-router-dom';
import { Scissors, User, ChevronLeft } from 'lucide-react';

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center relative px-6">
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="flex items-center text-neutral-500 hover:text-primary-600 transition-colors font-medium group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Choose Your Path</h1>
        <p className="text-lg text-neutral-600">How would you like to use the platform today?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Artist Card */}
        <Link 
          to="/auth/artist"
          className="group relative flex flex-col items-center p-10 bg-white rounded-3xl border-2 border-transparent shadow-sm transition-all hover:border-primary-500 hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
            <Scissors className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-3 text-center">I'm an Artist</h2>
          <p className="text-neutral-600 text-center leading-relaxed">
            I want to list my services, manage bookings, and grow my beauty business.
          </p>
        </Link>

        {/* Client Card */}
        <Link 
          to="/auth/client"
          className="group relative flex flex-col items-center p-10 bg-white rounded-3xl border-2 border-transparent shadow-sm transition-all hover:border-primary-500 hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
            <User className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-3 text-center">I'm a Client</h2>
          <p className="text-neutral-600 text-center leading-relaxed">
            I want to discover top artists, book appointments, and look my best.
          </p>
        </Link>
      </div>
    </div>
  );
}
