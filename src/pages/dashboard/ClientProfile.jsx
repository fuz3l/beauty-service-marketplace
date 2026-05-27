import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Sparkles, MapPin, Phone } from 'lucide-react';
import ClientNavbar from '../../components/layout/ClientNavbar';

export default function ClientProfile() {
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      
      // Fetch pending bookings count
      fetch('/api/bookings/my?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.bookings) {
          setPendingCount(data.bookings.filter(b => b.status === 'pending').length);
        }
      })
      .catch(err => console.error('Failed to fetch bookings count', err));
    } else {
      navigate('/role-selection');
    }
  }, [navigate]);

  if (!user) return null;

  const initial = user?.name ? user.name[0].toUpperCase() : 'C';

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <ClientNavbar user={user} pendingBookingsCount={pendingCount} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
          <p className="text-neutral-500 mt-2">Manage your account settings and personal information</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Cover Photo Area */}
          <div className="h-32 bg-gradient-to-r from-rose-400 to-rose-500 relative">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm opacity-30"></div>
          </div>

          {/* Profile Header */}
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-8">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
                  <div className="w-full h-full bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-4xl border-4 border-white">
                    {initial}
                  </div>
                </div>
                <div className="ml-6 mt-12">
                  <h2 className="text-2xl font-bold text-neutral-900 flex items-center">
                    {user.name}
                    <Sparkles className="w-5 h-5 text-rose-500 ml-2" />
                  </h2>
                  <p className="text-neutral-500 font-medium">GlamBook Client</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Personal Information</h3>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-neutral-500 font-medium">Full Name</p>
                    <p className="text-neutral-900 font-semibold">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-neutral-500 font-medium">Email Address</p>
                    <p className="text-neutral-900 font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start opacity-60">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-neutral-500 font-medium">Phone Number</p>
                    <p className="text-neutral-900 font-semibold italic">Not provided</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Account Security</h3>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-neutral-500 font-medium">Account Role</p>
                    <p className="text-neutral-900 font-semibold capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors hover:underline">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
