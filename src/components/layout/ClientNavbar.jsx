import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bell, User, Calendar, Settings, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function ClientNavbar({ user, pendingBookingsCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Browse Artists', path: '/browse', hash: '' },
    { name: 'My Bookings', path: '/client/dashboard', hash: '#bookings' },
    { name: 'How It Works', path: '/how-it-works', hash: '' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const initial = user?.name ? user.name[0].toUpperCase() : 'C';

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 text-rose-500 font-bold text-xl cursor-pointer" onClick={() => navigate('/client/dashboard')}>
              <Sparkles className="w-6 h-6" />
              <span>GlamBook</span>
            </div>
            
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navLinks.map(link => {
                const active = location.pathname === link.path && location.hash === link.hash;
                return (
                  <Link 
                    key={link.name}
                    to={`${link.path}${link.hash}`} 
                    className={`px-3 py-5 text-sm font-medium transition-colors border-b-2 ${
                      active ? 'text-rose-600 border-rose-600' : 'text-neutral-500 hover:text-rose-500 border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Nav (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="relative text-neutral-500 hover:text-rose-500 transition-colors focus:outline-none"
              >
                <Bell className="w-6 h-6" />
                {pendingBookingsCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <h3 className="font-bold text-neutral-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {pendingBookingsCount > 0 ? (
                      <div 
                        onClick={() => {
                          setIsNotificationDropdownOpen(false);
                          const el = document.getElementById('bookings');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                          navigate('/client/dashboard#bookings');
                        }}
                        className="px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <p className="text-sm text-neutral-800">
                          You have <span className="font-bold text-rose-600">{pendingBookingsCount}</span> pending booking{pendingBookingsCount > 1 ? 's' : ''} awaiting artist confirmation.
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">Click to view your bookings</p>
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <Bell className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold border border-rose-200 hover:ring-2 hover:ring-rose-300 transition-all focus:outline-none"
              >
                {initial}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-50">
                  <Link to="/client/profile" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600">
                    <User className="w-4 h-4 mr-3" /> My Profile
                  </Link>
                  <Link to="/client/dashboard#bookings" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600">
                    <Calendar className="w-4 h-4 mr-3" /> My Bookings
                  </Link>
                  <Link to="/client/profile" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600">
                    <Settings className="w-4 h-4 mr-3" /> Settings
                  </Link>
                  <div className="border-t border-neutral-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => {
              const active = location.pathname === link.path && location.hash === link.hash;
              return (
                <Link 
                  key={link.name}
                  to={`${link.path}${link.hash}`} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    active ? 'bg-rose-50 text-rose-600' : 'text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">
                {initial}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-800">{user?.name}</div>
                <div className="text-sm font-medium text-neutral-500">{user?.email}</div>
              </div>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('bookings');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  navigate('/client/dashboard#bookings');
                }}
                className="ml-auto flex-shrink-0 p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none relative"
              >
                <Bell className="h-6 w-6" />
                {pendingBookingsCount > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link to="/client/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50">My Profile</Link>
              <Link to="/client/dashboard#bookings" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50">My Bookings</Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
