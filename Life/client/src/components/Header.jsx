import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
  <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md transition-all duration-300">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              {/* Animated Icon on Hover */}
              <div className="rounded-full bg-light-green p-2 transition-transform duration-300 group-hover:scale-110">
                <Droplet className="h-6 w-6 text-primary-green" />
              </div>
              <span className="font-cursive text-4xl text-green-500">LifeLink</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/find-match" className="text-sm font-medium text-gray-600 hover:text-primary-green transition-colors">
              Find a Match
            </Link>
            
            {/* ONLY show Admin links if user is admin */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-primary-green transition-colors">
                  Admin
                </Link>
                <Link to="/admin/hospital-dashboard" className="text-sm font-medium text-gray-600 hover:text-primary-green transition-colors">
                  Hospital Dashboard
                </Link>
              </>
            )}
            
            <Link 
              to="/emergency-request" 
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              Need Blood
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="h-8 w-8 rounded-full bg-primary-green flex items-center justify-center text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-md border border-primary-green px-4 py-2 text-sm font-medium text-primary-green hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark-green transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-green focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/find-match"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-green"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find a Match
              </Link>
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-green"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <Link
                    to="/admin/hospital-dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-green"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hospital Dashboard
                  </Link>
                </>
              )}
              
              <Link
                to="/emergency-request"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Need Blood
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-primary-green flex items-center justify-center text-white mr-2">
                      {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                    </div>
                    <span className="text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-green"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-green hover:bg-dark-green"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}