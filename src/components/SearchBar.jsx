import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song..."
        className="px-4 py-2 rounded-full text-black w-80"
      />
      <button type="submit" className="px-6 py-2 bg-green-600 rounded-full font-bold">
        Search
      </button>
    </form>
  );
};

export default SearchBar;