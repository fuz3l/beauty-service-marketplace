import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-primary-300/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 text-center max-w-3xl px-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl shadow-primary-500/10 border border-white/50">
            <Sparkles className="w-12 h-12 text-primary-600" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-6 drop-shadow-sm">
          Discover Premium <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
            Beauty Services
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate marketplace connecting top-tier beauty artists with clients who demand perfection. Book your next glow-up or manage your beauty business seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/role-selection"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-full overflow-hidden transition-all hover:bg-primary-700 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25 active:scale-95 w-full sm:w-auto"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            to="/role-selection"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-700 bg-white/80 backdrop-blur-sm border border-primary-100 rounded-full transition-all hover:bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 active:scale-95 w-full sm:w-auto"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
