import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn } from 'lucide-react';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  return (
    <nav className="bg-white border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-rose-500 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-900">
                GlowMarket
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/browse" className="text-neutral-600 hover:text-rose-600 font-medium transition-colors">
              Browse Artists
            </Link>
            {token && userStr ? (
              <button 
                onClick={() => {
                  const user = JSON.parse(userStr);
                  navigate(user.role === 'artist' ? '/artist/dashboard' : '/client/dashboard');
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-xl font-medium transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <Link 
                to="/role-selection" 
                className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm shadow-rose-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
