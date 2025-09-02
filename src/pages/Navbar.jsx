import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Edit, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  const handleProfileEdit = () => {
    navigate('/edit-profile');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              UserDetails
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated user navigation
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleProfileEdit}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/edit-profile')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>

                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.firstName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link
                  to="/signin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/signin')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/signup"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                    isActive('/signup') ? 'bg-blue-700' : ''
                  }`}
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;