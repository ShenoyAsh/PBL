import React from 'react';

export default function TextClassificationResult({ label }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
      <h3 className="text-lg font-semibold mb-2">Emergency Case Classification</h3>
      <div className="text-xl font-bold text-blue-600">{label ?? 'Unknown'}</div>
      <p className="mt-2 text-sm text-gray-600">Shows the predicted category for the emergency case.</p>
    </div>
  );
}
