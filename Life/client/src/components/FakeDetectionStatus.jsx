import React from 'react';

export default function FakeDetectionStatus({ status }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
      <h3 className="text-lg font-semibold mb-2">Fake Request Detection</h3>
      <div className={`text-xl font-bold ${status === 'Fake' ? 'text-red-600' : 'text-green-600'}`}>{status ?? 'Unknown'}</div>
      <p className="mt-2 text-sm text-gray-600">Shows if the current request is flagged as fake or genuine.</p>
    </div>
  );
}
