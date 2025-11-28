import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, ShieldCheck, Brain } from 'lucide-react';

const features = [
  {
    name: 'Location-Aware Matching',
    description: 'Our system instantly finds the nearest compatible donors using advanced geospatial queries, reducing critical wait times significantly.',
    icon: MapPin,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Real-Time Alerts',
    description: 'Patients and verified donors are connected instantly via SMS and email alerts, facilitating immediate life-saving communication.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    name: 'Verified Trust Network',
    description: 'Every donor is verified via OTP and admin checks to ensure a safe, reliable, and secure network of willing participants.',
    icon: ShieldCheck,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'AI-Powered Insights',
    description: 'Utilizing Gemini AI to classify emergency urgency and analyze donor feedback, ensuring smarter and faster decision making.',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

export default function FeatureCards() {
  return (
    <div className="py-24 sm:py-32 bg-red-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4" // Updated grid for 4 items
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={cardVariants}
              whileHover={{ y: -8 }} // Lift effect
              className="relative flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-900/5 transition-shadow hover:shadow-xl"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-7 text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}