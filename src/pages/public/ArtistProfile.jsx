import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/artists/${id}`);
        if (!res.ok) throw new Error('Artist not found');
        const data = await res.json();
        setArtist(data.artist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  const openBookingModal = (service) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please log in as a client to book a service!');
      navigate('/role-selection');
      return;
    }
    
    const user = JSON.parse(userStr);
    if (user.role !== 'client') {
      alert('Only clients can book services. You are logged in as an artist.');
      return;
    }

    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Artist Not Found</h2>
          <p className="text-neutral-500 mb-6">We couldn't find the profile you're looking for.</p>
          <Link to="/browse" className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link to="/browse" className="inline-flex items-center text-neutral-500 hover:text-rose-600 mb-6 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Artists
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-neutral-100 flex-shrink-0">
                {artist.avatar ? (
                  <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-400">
                    {artist.name[0]}
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-extrabold text-neutral-900 flex items-center">
                  {artist.name}
                  {artist.isVerified && (
                    <CheckCircle className="w-6 h-6 text-blue-500 ml-2" />
                  )}
                </h1>
                <p className="text-xl text-neutral-500 mt-1">{artist.speciality || 'Beauty Professional'}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className="flex items-center text-neutral-600 text-sm font-medium bg-neutral-100 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-1.5 text-neutral-400" />
                    {artist.location || 'Location unverified'}
                  </span>
                  <span className="flex items-center text-neutral-600 text-sm font-bold">
                    <Star className="w-4 h-4 mr-1 text-amber-400 fill-current" />
                    {artist.rating > 0 ? artist.rating : 'New'} <span className="text-neutral-400 font-normal ml-1">({artist.reviewCount} reviews)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Portfolio & Reviews */}
        <div className="md:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Portfolio</h2>
            {artist.portfolio && artist.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {artist.portfolio.map((img) => (
                  <div key={img.id} className="aspect-square rounded-2xl overflow-hidden bg-neutral-200">
                    <img src={img.url} alt="Portfolio work" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 border-dashed p-12 text-center text-neutral-500">
                This artist hasn't uploaded any portfolio images yet.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Reviews</h2>
            {artist.reviews && artist.reviews.length > 0 ? (
              <div className="space-y-4">
                {artist.reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-amber-400 fill-current">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                      <span className="ml-3 font-bold text-neutral-900">{review.client?.name}</span>
                    </div>
                    {review.comment && <p className="text-neutral-600 mt-2">{review.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 border-dashed p-12 text-center text-neutral-500">
                No reviews yet. Be the first to book!
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Services */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Services Offered</h2>
            
            {artist.services && artist.services.length > 0 ? (
              <div className="space-y-4">
                {artist.services.map((service) => (
                  <div key={service.id} className="border border-neutral-100 rounded-xl p-4 hover:border-rose-200 hover:shadow-md transition-all group cursor-pointer bg-neutral-50 hover:bg-white" onClick={() => openBookingModal(service)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-neutral-900 leading-tight">{service.title}</h3>
                      <span className="font-extrabold text-rose-600 text-lg ml-2 shrink-0">₹{service.price.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="inline-block bg-neutral-200 text-neutral-600 text-xs px-2 py-1 rounded capitalize font-medium mb-4">{service.serviceType}</span>
                    
                    <button className="w-full bg-neutral-900 text-white font-bold py-2.5 rounded-lg group-hover:bg-rose-500 transition-colors">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">This artist hasn't listed any services yet.</p>
            )}
          </div>
        </div>

      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedService && (
        <BookingModal 
          artistId={artist.id}
          service={selectedService} 
          onClose={() => setIsBookingModalOpen(false)} 
        />
      )}
    </div>
  );
}

// Booking Modal Component
const BookingModal = ({ artistId, service, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          artistId,
          serviceId: service.id,
          date,
          time
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to book');
      }
    } catch (err) {
      alert('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Booking Requested!</h2>
          <p className="text-neutral-500 mb-8 text-lg">Your request has been sent to the artist. They will confirm it shortly.</p>
          <button onClick={() => navigate('/client/dashboard')} className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl hover:bg-rose-600 transition-colors text-lg">
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Request Booking</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 bg-neutral-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="bg-neutral-50 rounded-xl p-4 mb-6 border border-neutral-200">
          <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider mb-1">Service Selected</p>
          <h3 className="font-bold text-neutral-900 text-lg">{service.title}</h3>
          <p className="font-extrabold text-rose-600 text-xl mt-1">₹{service.price.toLocaleString('en-IN')}</p>
        </div>

        <form onSubmit={handleBook} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Select Date</label>
            <input 
              required 
              type="date" 
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)} 
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center"><Clock className="w-4 h-4 mr-2"/> Select Time</label>
            <input 
              required 
              type="time" 
              value={time}
              onChange={e => setTime(e.target.value)} 
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-medium" 
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl hover:bg-rose-600 transition-colors mt-8 text-lg shadow-lg shadow-rose-500/30">
            {loading ? 'Sending Request...' : 'Confirm Request'}
          </button>
        </form>
      </div>
    </div>
  );
};
