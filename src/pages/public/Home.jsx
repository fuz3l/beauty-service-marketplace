import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Search, MapPin, Navigation } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state || '';
        
        if (city) {
          setLocationQuery(city);
          navigate(`/browse?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(city)}`);
        } else {
          alert('Could not determine your city name.');
        }
      } catch (err) {
        alert('Failed to fetch location data.');
      } finally {
        setGeoLoading(false);
      }
    }, () => {
      alert('Please allow location access in your browser.');
      setGeoLoading(false);
    });
  };

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

        <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl shadow-primary-500/10 border border-neutral-200 w-full max-w-3xl flex flex-col md:flex-row gap-2 mb-8">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4" />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-neutral-900 placeholder-neutral-400 outline-none"
            />
          </div>
          <div className="w-px bg-neutral-200 hidden md:block"></div>
          <div className="flex-1 relative flex items-center border-t border-neutral-100 md:border-none">
            <MapPin className="w-5 h-5 text-neutral-400 absolute left-4" />
            <input 
              type="text" 
              placeholder="Location" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-transparent border-none focus:ring-0 text-neutral-900 placeholder-neutral-400 outline-none"
            />
            <button 
              type="button"
              onClick={handleNearMe}
              disabled={geoLoading}
              className="absolute right-3 p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
              title="Use current location"
            >
              <Navigation className={`w-5 h-5 ${geoLoading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <button 
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/role-selection"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-primary-700 bg-white/80 backdrop-blur-sm border border-primary-100 rounded-full transition-all hover:bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 active:scale-95 w-full sm:w-auto"
          >
            Create an Account
          </Link>
          
          <Link
            to="/role-selection"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-primary-700 bg-white/80 backdrop-blur-sm border border-primary-100 rounded-full transition-all hover:bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 active:scale-95 w-full sm:w-auto"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
