import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, ShieldCheck } from 'lucide-react';

const features = [
  {
    name: 'Location-Aware Matching',
    description: 'Our system instantly finds the nearest compatible donors using geospatial queries, minimizing critical wait times.',
    icon: MapPin,
  },
  {
    name: 'Real-Time Connectivity',
    description: 'Patients and verified donors are connected in real-time via email and SMS alerts, facilitating immediate communication.',
    icon: Zap,
  },
  {
    name: 'Verified Network',
    description: 'All donors are verified via OTP and admin checks, ensuring a safe and reliable network of willing participants.',
    icon: ShieldCheck,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

export default function FeatureCards() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition duration-300 hover:shadow-xl hover:ring-primary-green/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-light-green text-primary-green">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-7 text-gray-900">{feature.name}</h3>
              <p className="mt-4 text-base leading-7 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}