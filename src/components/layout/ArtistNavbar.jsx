import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, User, Settings, LogOut, Menu, X, Scissors } from 'lucide-react';

export default function ArtistNavbar({ user, pendingRequestsCount = 0, onEditProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const initial = user?.name ? user.name[0].toUpperCase() : 'A';

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 text-rose-500 font-bold text-xl cursor-pointer" onClick={() => navigate('/artist/dashboard')}>
              <Scissors className="w-6 h-6" />
              <span>GlamBook Artist</span>
            </div>
            
            <div className="hidden lg:flex lg:ml-10 lg:space-x-8">
              <Link to="/artist/dashboard" className="text-rose-600 border-b-2 border-rose-600 px-1 py-5 text-sm font-medium">Dashboard</Link>
              <Link to="/artist/dashboard" className="text-neutral-500 hover:text-rose-500 px-1 py-5 text-sm font-medium transition-colors">Booking Requests</Link>
              <Link to="/artist/dashboard" className="text-neutral-500 hover:text-rose-500 px-1 py-5 text-sm font-medium transition-colors">My Services</Link>
              <Link to="/artist/dashboard" className="text-neutral-500 hover:text-rose-500 px-1 py-5 text-sm font-medium transition-colors">Portfolio</Link>
            </div>
          </div>

          {/* Right Nav (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6">
            <button className="relative text-neutral-500 hover:text-rose-500 transition-colors">
              <Bell className="w-6 h-6" />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold border border-rose-200 hover:ring-2 hover:ring-rose-300 transition-all focus:outline-none"
              >
                {initial}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                    <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  <Link to="/browse" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600">
                    <User className="w-4 h-4 mr-3" /> View Public Profile
                  </Link>
                  <button onClick={() => { setIsProfileDropdownOpen(false); onEditProfile(); }} className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600">
                    <Settings className="w-4 h-4 mr-3" /> Edit Profile
                  </button>
                  <Link to="/artist/dashboard" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600">
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
          <div className="flex items-center lg:hidden">
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
        <div className="lg:hidden bg-white border-b border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/artist/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-rose-50 text-rose-600">Dashboard</Link>
            <Link to="/artist/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-50 flex justify-between">
              Booking Requests
              {pendingRequestsCount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{pendingRequestsCount}</span>}
            </Link>
            <Link to="/artist/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-50">My Services</Link>
            <Link to="/artist/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-50">Portfolio</Link>
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
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50">View Public Profile</Link>
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
