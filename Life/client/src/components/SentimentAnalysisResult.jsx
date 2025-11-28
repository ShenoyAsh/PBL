import React from 'react';

export default function SentimentAnalysisResult({ sentiment }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
      <h3 className="text-lg font-semibold mb-2">Donor Feedback Sentiment</h3>
      <div className={`text-xl font-bold ${sentiment === 'Positive' ? 'text-green-600' : sentiment === 'Negative' ? 'text-red-600' : 'text-gray-600'}`}>{sentiment ?? 'N/A'}</div>
      <p className="mt-2 text-sm text-gray-600">Shows the sentiment detected from donor feedback.</p>
    </div>
  );
}
