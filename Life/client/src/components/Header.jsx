import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-md">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Droplet className="h-8 w-8 text-primary-green" />
            <span className="font-cursive text-4xl text-primary-green">LifeLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/find-match" className="text-sm font-medium text-gray-600 hover:text-primary-green">
              Find a Match
            </Link>
            <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-primary-green">
              Admin
            </Link>
            <Link
              to="/register-patient"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            >
              Need Blood
            </Link>
            <Link
              to="/register-donor"
              className="rounded-md bg-primary-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark-green"
            >
              Become a Donor
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}