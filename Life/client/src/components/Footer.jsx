import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-light-green p-2">
                <Droplet className="h-6 w-6 text-primary-green" />
              </div>
              <span className="font-cursive text-2xl text-primary-green">LifeLink</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting donors and patients in real-time. We bridge the gap between emergency needs and willing hearts using advanced technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-primary-green transition-colors">Home</Link></li>
              <li><Link to="/find-match" className="hover:text-primary-green transition-colors">Find a Match</Link></li>
              <li><Link to="/emergency-request" className="hover:text-primary-green transition-colors">Emergency Request</Link></li>
              <li><Link to="/register-donor" className="hover:text-primary-green transition-colors">Donate Blood</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-primary-green transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-green transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-green transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-primary-green transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-green" />
                <span>123 Health Avenue, Tech City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-green" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-green" />
                <span>support@lifelink.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} LifeLink. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary-green transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary-green transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary-green transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary-green transition-colors"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}