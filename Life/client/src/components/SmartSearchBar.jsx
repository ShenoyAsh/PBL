import React, { useState } from 'react';

export default function SmartSearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // TODO: Connect to backend for real suggestions
  const handleInput = (e) => {
    setQuery(e.target.value);
    // setSuggestions([...]);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Smart Search</label>
      <input
        type="text"
        value={query}
        onChange={handleInput}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-green focus:ring-primary-green"
        placeholder="Type to search..."
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white border rounded shadow text-sm">
          {suggestions.map((s, i) => (
            <li key={i} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => onSearch(s)}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
