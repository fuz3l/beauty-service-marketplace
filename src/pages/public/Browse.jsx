import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Sparkles, Navigation } from 'lucide-react';
import ArtistCard from '../../components/shared/ArtistCard';
import ClientNavbar from '../../components/layout/ClientNavbar';

export default function Browse() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (initialSearch) queryParams.append('q', initialSearch);
        if (initialLocation) queryParams.append('location', initialLocation);
        if (initialType) queryParams.append('type', initialType);

        const res = await fetch(`/api/artists/search?${queryParams.toString()}`);
        const data = await res.json();
        setArtists(data.artists || []);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [initialSearch, initialLocation, initialType]);

  const [geoLoading, setGeoLoading] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {user && user.role === 'client' ? (
        <ClientNavbar user={user} />
      ) : (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 p-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-500 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
              <Sparkles className="w-6 h-6" />
              <span>GlamBook</span>
            </div>
            <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-rose-500 font-medium">Back</button>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center"><SlidersHorizontal className="w-5 h-5 mr-2"/> Filters</h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name or service..."
                    className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:ring-rose-500 focus:border-rose-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City or area..."
                    className="w-full pl-9 pr-10 py-2 border border-neutral-300 rounded-xl focus:ring-rose-500 focus:border-rose-500 text-sm outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={handleNearMe}
                    disabled={geoLoading}
                    className="absolute right-2 top-2 text-rose-500 hover:text-rose-600 transition-colors disabled:opacity-50"
                    title="Use my current location"
                  >
                    <Navigation className={`w-5 h-5 ${geoLoading ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors">
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">
              {initialType ? `${initialType} Artists` : 'Search Results'}
            </h1>
            <p className="text-neutral-500">{artists.length} makeup artists found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-white rounded-2xl h-80 shadow-sm border border-neutral-200"></div>)}
            </div>
          ) : artists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {artists.map(artist => (
                <ArtistCard key={artist.id} {...artist} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 border-dashed p-16 text-center">
              <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No artists found</h3>
              <p className="text-neutral-500 max-w-md mx-auto">We couldn't find any verified makeup artists matching your exact criteria. Try adjusting your search terms or location.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setLocationQuery('');
                  navigate('/browse');
                }}
                className="mt-6 text-rose-600 font-medium hover:underline px-4 py-2 bg-rose-50 rounded-xl"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
