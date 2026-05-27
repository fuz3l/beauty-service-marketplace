import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, MapPin, Calendar, Clock, Sparkles, ChevronRight, X } from 'lucide-react';
import ClientNavbar from '../../components/layout/ClientNavbar';
import ArtistCard from '../../components/shared/ArtistCard';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artists, setArtists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'Bridal', icon: '💍', queryParam: 'bridal', count: 0 },
    { name: 'Party', icon: '🎉', queryParam: 'party', count: 0 },
    { name: 'Editorial', icon: '📸', queryParam: 'editorial', count: 0 },
    { name: 'HD Makeup', icon: '✨', queryParam: 'hd', count: 0 },
    { name: 'Natural Look', icon: '🌿', queryParam: 'natural', count: 0 },
    { name: 'Airbrush', icon: '💨', queryParam: 'airbrush', count: 0 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/role-selection');
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [artistsRes, bookingsRes, categoriesRes] = await Promise.all([
          fetch('/api/artists?featured=true&limit=6', { headers }),
          fetch('/api/bookings/my?limit=10', { headers }), // Increased limit to show more recent bookings
          fetch('/api/artists/categories', { headers })
        ]);

        if (!artistsRes.ok || !bookingsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to load data');
        }

        const artistsData = await artistsRes.json();
        const bookingsData = await bookingsRes.json();
        const categoriesData = await categoriesRes.json();

        setArtists(artistsData.artists || []);
        setBookings(bookingsData.bookings || []);
        
        // Merge category counts
        if (categoriesData.categories) {
          setCategories(prev => prev.map(c => {
            const match = categoriesData.categories.find(cat => cat.queryParam === c.queryParam);
            return match ? { ...c, count: match.count } : c;
          }));
        }

      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  useEffect(() => {
    if (location.hash === '#bookings') {
      setTimeout(() => {
        const element = document.getElementById('bookings');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure render
    }
  }, [location.hash, bookings.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'rejected');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');
  const pendingCount = activeBookings.filter(b => b.status === 'pending').length;

  const handleDismissNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <ClientNavbar user={user} pendingBookingsCount={pendingCount} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-2 text-rose-500 font-medium tracking-wide text-sm">
            {format(new Date(), 'EEEE, d MMM yyyy')}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">
            {getGreeting()}, {user.name?.split(' ')[0] || 'Beautiful'} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-neutral-500 text-lg">What beauty service are you looking for today?</p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-8">
        
        {/* Notifications */}
        {rejectedBookings.length > 0 && (
          <div className="mb-8 space-y-3 relative z-20">
            {rejectedBookings.map(b => (
              <div key={b.id} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3 text-red-600">
                    <X className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold">{b.artist?.user?.name || 'Your artist'}</span> has cancelled/rejected your <span className="font-bold">{b.service?.title}</span> booking for {format(new Date(b.date), 'MMM d, yyyy')}.
                  </div>
                </div>
                <button 
                  onClick={() => handleDismissNotification(b.id)}
                  className="text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="text-red-700 font-bold hover:underline">Retry</button>
          </div>
        )}



        {/* Search Bar */}
        <div className="mb-12">
          <label className="block text-neutral-700 font-bold mb-3 text-lg">Find a makeup artist near you</label>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-2xl shadow-sm border border-neutral-200 relative z-10">
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-100">
              <Search className="w-5 h-5 text-neutral-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search by name or service..." 
                className="w-full bg-transparent border-none focus:ring-0 text-neutral-900 placeholder-neutral-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2">
              <MapPin className="w-5 h-5 text-neutral-400 mr-3" />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full bg-transparent border-none focus:ring-0 text-neutral-900 placeholder-neutral-400"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-sm md:ml-2">
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4 px-1">
            {['Bridal', 'Party Makeup', 'HD Makeup', 'Airbrush', 'Natural Look'].map(tag => (
              <button 
                key={tag} 
                onClick={() => navigate(`/browse?type=${tag}`)}
                className="text-xs md:text-sm bg-white border border-neutral-200 text-neutral-600 px-4 py-1.5 rounded-full hover:border-rose-300 hover:text-rose-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Artists */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Featured Artists Near You</h2>
              <p className="text-neutral-500 mt-1">Verified professionals ready to book</p>
            </div>
            <Link to="/browse" className="text-rose-600 font-medium hover:underline flex items-center hidden md:flex">
              See All Artists <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-white rounded-2xl h-80 shadow-sm border border-neutral-100"></div>)}
            </div>
          ) : artists.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 snap-x">
              {artists.map(artist => (
                <div key={artist.id} className="min-w-[280px] w-[85vw] md:w-auto md:min-w-0 snap-center">
                  <ArtistCard {...artist} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 border-dashed p-12 text-center">
              <Sparkles className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">No artists found in your area yet.</h3>
              <Link to="/browse" className="text-rose-600 font-medium hover:underline inline-flex items-center">
                Browse all artists <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Browse by Category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Browse by Service Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const bgColors = ['bg-rose-50', 'bg-blue-50', 'bg-emerald-50', 'bg-amber-50', 'bg-purple-50', 'bg-sky-50'];
              const textColors = ['text-rose-600', 'text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-purple-600', 'text-sky-600'];
              const colorIdx = i % bgColors.length;
              
              return (
                <div 
                  key={cat.name} 
                  onClick={() => navigate(`/browse?type=${cat.queryParam}`)}
                  className={`${bgColors[colorIdx]} p-6 rounded-2xl shadow-sm border border-transparent hover:border-neutral-200 hover:shadow-md hover:scale-105 cursor-pointer transition-all duration-300 text-center flex flex-col items-center justify-center h-40`}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className={`font-bold text-neutral-900 mb-1 leading-tight`}>{cat.name}</h3>
                  {loading ? (
                    <div className="w-10 h-3 bg-neutral-200 rounded animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-neutral-500 text-xs font-medium">{cat.count} artists</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings OR CTA Banner */}
        {loading ? (
          <div className="mb-12">
             <h2 className="text-2xl font-bold text-neutral-900 mb-6">Your Recent Bookings</h2>
             <div className="space-y-4">
               {Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-white rounded-xl h-24 shadow-sm border border-neutral-100 w-full"></div>)}
             </div>
          </div>
        ) : bookings.length > 0 ? (
          <div id="bookings" className="mb-12 scroll-mt-24">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Your Recent Bookings</h2>
              <Link to="/client/dashboard#bookings" className="text-rose-600 font-medium hover:underline flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeBookings.map(booking => {
                const statusColors = {
                  pending: 'bg-yellow-100 text-yellow-700',
                  confirmed: 'bg-green-100 text-green-700',
                  completed: 'bg-gray-100 text-gray-600',
                  rejected: 'bg-red-100 text-red-600'
                };

                return (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between group hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4 sm:mb-0">
                      {booking.artist.user.avatar ? (
                        <img src={booking.artist.user.avatar} alt={booking.artist.user.name} className="w-14 h-14 rounded-full object-cover border-2 border-rose-50" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-50 flex-shrink-0">
                          {booking.artist.user.name?.[0].toUpperCase() || 'A'}
                        </div>
                      )}
                      
                      <div className="ml-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-neutral-900">{booking.artist.user.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-neutral-600 text-sm mb-1">{booking.service.title}</p>
                        <div className="flex items-center text-neutral-500 text-sm">
                          <Calendar className="w-3.5 h-3.5 mr-1" /> {format(new Date(booking.date), 'MMM d, yyyy')}
                          <span className="mx-2">•</span>
                          <Clock className="w-3.5 h-3.5 mr-1" /> {booking.time}
                          <span className="mx-2">•</span>
                          <span className="font-bold text-neutral-700">{formatPrice(booking.service.price)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center justify-end space-x-3 sm:space-x-0 sm:space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>{booking.status}</span>
                      
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center justify-center px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div id="bookings" className="mb-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-lg relative overflow-hidden scroll-mt-24">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Ready for your first booking?</h2>
              <p className="text-rose-100 text-lg mb-8 max-w-xl mx-auto">Browse from 200+ verified makeup artists near you and get glamorous for your next big event.</p>
              <button onClick={() => navigate('/browse')} className="bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-50 hover:scale-105 transition-all shadow-md inline-flex items-center">
                Find an Artist <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
