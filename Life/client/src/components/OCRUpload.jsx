import React, { useState } from 'react';

export default function OCRUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  // TODO: Connect to backend for real OCR
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult('');
  };

  const handleUpload = () => {
    // Simulate OCR result
    setResult('Sample extracted text from medical report.');
    if (onResult) onResult('Sample extracted text from medical report.');
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-2">Upload Medical Report (OCR)</h3>
      <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="ml-2 rounded bg-primary-green px-3 py-1 text-white text-sm hover:bg-dark-green"
      >
        Extract Text
      </button>
      {result && <div className="mt-4 text-sm text-gray-700"><strong>Result:</strong> {result}</div>}
    </div>
  );
}
