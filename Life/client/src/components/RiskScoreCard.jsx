import React from 'react';

export default function RiskScoreCard({ score }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
      <h3 className="text-lg font-semibold mb-2">Donor Risk Score</h3>
      <div className="text-3xl font-bold text-red-600">{score ?? 'N/A'}</div>
      <p className="mt-2 text-sm text-gray-600">This score estimates donor eligibility and risk based on system analysis.</p>
    </div>
  );
}
