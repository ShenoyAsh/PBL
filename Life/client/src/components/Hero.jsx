import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white pt-14 pb-16 sm:pb-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <img 
          src="https://www.ajhospital.in/storage/files/news/Blog/drive-download-20210608T141955Z-001/Feature.png" 
          alt="Medical Team" 
          className="h-full w-full object-cover object-center opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-primary-green/20 bg-light-green/50 px-3 py-1 text-sm text-dark-green backdrop-blur-sm">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary-green"></span>
            Connecting Donors & Patients in Real-Time
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-6">
            <span className="font-cursive text-primary-green">LifeLink</span>
            <br />
            <span className="text-4xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
               A Digital Lifeline
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            We bridge the critical gap between emergency patients and willing blood donors. 
            Our platform uses geolocation to find the nearest help when seconds count.
          </p>
          
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              to="/register-donor"
              className="rounded-full bg-primary-green px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-200 transition-all hover:scale-105 hover:bg-dark-green hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              Become a Donor
            </Link>
            <Link
              to="/find-match"
              className="text-base font-semibold leading-6 text-gray-900 transition-colors hover:text-primary-green flex items-center gap-2"
            >
              Find a Match <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}