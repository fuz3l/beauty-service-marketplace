import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, User, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Validate role parameter
  if (role !== 'artist' && role !== 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Invalid Role</h2>
          <Link to="/role-selection" className="text-primary-600 hover:underline">
            Go back to role selection
          </Link>
        </div>
      </div>
    );
  }

  const roleDisplay = role === 'artist' ? 'Artist' : 'Client';
  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual authentication logic
    console.log(`Submitting ${isLogin ? 'Login' : 'Signup'} for ${roleDisplay}`);
    
    // Fake redirection to the appropriate dashboard
    const dashboardPath = role === 'artist' ? '/artist/dashboard' : '/client/dashboard';
    navigate(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left side: Image / Branding (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary-900 relative overflow-hidden items-center justify-center">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-800 to-primary-950 opacity-90"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 text-center px-12">
          <Sparkles className="w-16 h-16 text-primary-200 mx-auto mb-8 opacity-80" strokeWidth={1} />
          <h2 className="text-4xl font-bold text-white mb-6">
            {role === 'artist' 
              ? 'Elevate Your Beauty Business.' 
              : 'Discover Your Perfect Look.'}
          </h2>
          <p className="text-primary-200 text-lg max-w-md mx-auto leading-relaxed">
            {role === 'artist'
              ? 'Join the premium marketplace to showcase your talent, manage bookings effortlessly, and connect with clients.'
              : 'Explore top-tier artists, book appointments instantly, and experience beauty services redefined.'}
          </p>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 relative">
        <div className="absolute top-8 left-8 lg:left-8">
          <Link 
            to="/role-selection" 
            className="flex items-center text-neutral-500 hover:text-primary-600 transition-colors font-medium group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Change Role
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {isLogin ? `Welcome back, ${roleDisplay}` : `Create a ${roleDisplay} account`}
            </h1>
            <p className="text-neutral-500">
              {isLogin 
                ? 'Enter your details to access your account.' 
                : 'Sign up to get started with our platform.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:shadow-md active:scale-[0.98]"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-neutral-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={toggleMode}
              className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-all"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
