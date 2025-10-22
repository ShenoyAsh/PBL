import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-light-green/50 to-white pt-16 pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="font-cursive text-7xl text-primary-green">LifeLink</span>:
            <span className="ml-3">A Digital Lifeline</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            LifeLink represents an impactful approach to emergency medical donations—transforming how we connect willing donors with patients in their most critical moments. Our comprehensive digital platform eliminates the chaos of traditional donor searching.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/register-donor"
              className="rounded-md bg-primary-green px-5 py-3 text-base font-semibold text-white shadow-lg transition duration-200 hover:bg-dark-green hover:shadow-xl"
            >
              Register as a Donor
            </a>
            <a
              href="/find-match"
              className="text-base font-semibold leading-6 text-gray-900 transition duration-200 hover:text-gray-700"
            >
              Find a Match <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}