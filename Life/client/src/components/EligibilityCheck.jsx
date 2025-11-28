import React from 'react';

export default function EligibilityCheck({ eligible, reason }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
      <h3 className="text-lg font-semibold mb-2">Eligibility Check</h3>
      <div className={`text-xl font-bold ${eligible ? 'text-green-600' : 'text-red-600'}`}>{eligible ? 'Eligible' : 'Not Eligible'}</div>
      {reason && <p className="mt-2 text-sm text-gray-600">Reason: {reason}</p>}
    </div>
  );
}
