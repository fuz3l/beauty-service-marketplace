import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isThisWeek, isThisMonth, formatDistanceToNow } from 'date-fns';
import { Clock, CalendarCheck, CheckCircle, IndianRupee, MapPin, X, Check, Phone, Plus, Edit, Trash2, Share2, Upload } from 'lucide-react';
import ArtistNavbar from '../../components/layout/ArtistNavbar';

export default function ArtistDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0, monthEarnings: 0 });
  const [profile, setProfile] = useState({});
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true); // Default true for prototype
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [bookingsRes, servicesRes, portfolioRes, profileRes] = await Promise.all([
        fetch('/api/bookings/artist', { headers }),
        fetch('/api/services/my', { headers }),
        fetch('/api/portfolio/my', { headers }),
        fetch('/api/artists/profile', { headers })
      ]);

      if (!bookingsRes.ok || !servicesRes.ok || !portfolioRes.ok || !profileRes.ok) throw new Error('Failed to load data');

      const bData = await bookingsRes.json();
      const sData = await servicesRes.json();
      const pData = await portfolioRes.json();
      const profData = await profileRes.json();

      setBookings(bData.bookings || []);
      setServices(sData.services || []);
      setPortfolio(pData.images || []);
      setProfile(profData.profile || {});

      const now = new Date();
      setStats({
        pending: bData.bookings.filter(b => b.status === 'pending').length,
        confirmed: bData.bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= now).length,
        completed: bData.bookings.filter(b => b.status === 'completed').length,
        monthEarnings: bData.bookings
          .filter(b => ['confirmed', 'completed'].includes(b.status) && isThisMonth(new Date(b.createdAt)))
          .reduce((sum, b) => sum + (b.service?.price || 0), 0)
      });

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/role-selection');
      return;
    }

    fetchDashboard();

    // Polling every 30s
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboard(); // Refresh
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const deletePortfolioImage = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setPortfolio(prev => prev.filter(img => img.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadMockImage = async () => {
    try {
      const res = await fetch('/api/portfolio/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ url: `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&r=${Math.random()}` })
      });
      if (res.ok) fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://beautymarket.com/artist/${user?.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const todayBookings = bookings.filter(b => b.status === 'confirmed' && isThisMonth(new Date(b.date))); // Mocking today for dev

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <ArtistNavbar user={user} pendingRequestsCount={stats.pending} onEditProfile={() => setIsEditProfileOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="mb-2 text-rose-500 font-medium tracking-wide text-sm">
              {format(new Date(), 'EEEE, d MMM yyyy')}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">
              {getGreeting()}, {user.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-neutral-500 text-lg">Here's what's happening with your bookings today</p>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <button className="bg-white border border-rose-200 text-rose-600 px-6 py-2 rounded-xl font-medium shadow-sm hover:bg-rose-50 transition-colors">
              View Public Profile
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-8">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Pending Requests" value={stats.pending} icon={<Clock />} color="text-amber-500" bg="bg-amber-50" />
          <StatCard title="Confirmed Bookings" value={stats.confirmed} icon={<CalendarCheck />} color="text-blue-500" bg="bg-blue-50" />
          <StatCard title="Completed Jobs" value={stats.completed} icon={<CheckCircle />} color="text-green-500" bg="bg-green-50" />
          <StatCard title="This Month Earnings" value={formatPrice(stats.monthEarnings)} icon={<IndianRupee />} color="text-rose-500" bg="bg-rose-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Pending Requests */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Pending Requests</h2>
                {stats.pending > 0 && <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{stats.pending}</span>}
              </div>
              
              {pendingBookings.length > 0 ? (
                <div className="space-y-4">
                  {pendingBookings.slice(0, 5).map(b => (
                    <BookingRequestCard key={b.id} booking={b} onAccept={() => updateBookingStatus(b.id, 'confirmed')} onReject={() => updateBookingStatus(b.id, 'rejected')} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 border-dashed p-8 text-center text-neutral-500">
                  <p>No pending requests right now.</p>
                  <p className="text-sm mt-1">Share your profile to get more bookings!</p>
                </div>
              )}
            </div>

            {/* Portfolio Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">My Portfolio</h2>
                <button onClick={uploadMockImage} className="text-rose-600 font-medium hover:underline flex items-center text-sm">
                  <Upload className="w-4 h-4 mr-1" /> Upload Mock Photo
                </button>
              </div>
              
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {portfolio.slice(0, 8).map(img => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-100">
                      <img src={img.url} alt="Portfolio" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                        <button onClick={() => deletePortfolioImage(img.id)} className="bg-white p-1.5 rounded-lg text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 border-dashed p-8 text-center text-neutral-500">
                  <p>No portfolio images yet.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Today's Schedule</h2>
              {todayBookings.length > 0 ? (
                <div className="space-y-4">
                  {todayBookings.map(b => (
                    <div key={b.id} className="flex">
                      <div className="w-16 font-bold text-rose-500 text-sm">{b.time}</div>
                      <div className="flex-1 border-l-2 border-rose-100 pl-4 pb-4">
                        <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                          <p className="font-bold text-neutral-900 text-sm">{b.service?.title}</p>
                          <p className="text-neutral-500 text-sm">{b.client?.name || 'Client'}</p>
                          <div className="mt-2 flex space-x-2">
                            <button onClick={() => updateBookingStatus(b.id, 'completed')} className="text-xs bg-white border border-neutral-200 px-2 py-1 rounded text-neutral-700 hover:bg-neutral-100">Mark Complete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">No bookings scheduled for today. Enjoy your day! ☀️</p>
              )}
            </div>

            {/* My Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-neutral-900">My Services</h2>
                <button className="text-rose-600 p-1 hover:bg-rose-50 rounded"><Plus className="w-5 h-5"/></button>
              </div>
              {services.length > 0 ? (
                <div className="space-y-3">
                  {services.slice(0, 3).map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 border border-neutral-100 rounded-xl">
                      <div>
                        <p className="font-bold text-neutral-900 text-sm">{s.title}</p>
                        <p className="text-rose-600 font-medium text-sm">{formatPrice(s.price)}</p>
                      </div>
                      <button className="text-neutral-400 hover:text-neutral-600"><Edit className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-sm">
                  ⚠️ You haven't added any services yet.
                </div>
              )}
            </div>

            {/* Share Profile */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-2">Share your profile!</h3>
              <p className="text-rose-100 text-sm mb-4">Get more clients by sharing your link.</p>
              <div className="flex items-center bg-white/20 rounded-lg p-1">
                <input type="text" readOnly value={`beautymarket.com/artist/${user?.id}`} className="bg-transparent text-white text-sm px-2 w-full outline-none" />
                <button onClick={copyToClipboard} className="bg-white text-rose-600 text-sm font-bold px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {isEditProfileOpen && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditProfileOpen(false)} 
          onSave={() => { setIsEditProfileOpen(false); fetchDashboard(); }} 
        />
      )}
    </div>
  );
}

// Subcomponents
const StatCard = memo(({ title, value, icon, color, bg }) => (
  <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 hover:shadow-md cursor-pointer transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-2xl font-extrabold text-neutral-900">{value}</div>
        <div className="text-xs text-neutral-500 font-medium mt-1">{title}</div>
      </div>
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
    </div>
  </div>
));

const BookingRequestCard = memo(({ booking, onAccept, onReject }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col md:flex-row md:items-center justify-between group">
    <div className="flex items-start mb-4 md:mb-0">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold flex-shrink-0 mt-1">
        {booking.client?.name?.[0].toUpperCase() || 'C'}
      </div>
      <div className="ml-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-neutral-900">{booking.client?.name || 'Client'}</h3>
          <span className="text-xs text-neutral-400">• {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center text-neutral-500 text-sm mt-1">
          <MapPin className="w-3.5 h-3.5 mr-1" /> Mumbai
        </div>
        <div className="mt-2 text-sm text-neutral-700 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
          <p><span className="font-semibold">Service:</span> {booking.service?.title}</p>
          <p><span className="font-semibold">Date:</span> {format(new Date(booking.date), 'EEE, dd MMM yyyy')} at {booking.time}</p>
          <p><span className="font-semibold text-rose-600">Price: ₹{(booking.service?.price || 0).toLocaleString('en-IN')}</span></p>
        </div>
      </div>
    </div>
    <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
      <button onClick={onAccept} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors">
        <Check className="w-4 h-4 mr-1" /> Accept
      </button>
      <button onClick={onReject} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
        <X className="w-4 h-4 mr-1" /> Reject
      </button>
    </div>
  </div>
));

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [location, setLocation] = useState(profile?.location || '');
  const [speciality, setSpeciality] = useState(profile?.speciality || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/artists/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ location, speciality })
      });
      if (res.ok) {
        onSave();
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Edit Profile</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-rose-500 focus:border-rose-500" 
              placeholder="e.g. Mumbai, India"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Speciality</label>
            <input 
              type="text" 
              value={speciality}
              onChange={e => setSpeciality(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-rose-500 focus:border-rose-500" 
              placeholder="e.g. Bridal Makeup, Airbrush"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors mt-6">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
