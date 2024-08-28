import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('song'); // default category is 'song'

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, category);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-row items-center w-full max-w-xl'>
        <input
          className="flex-grow p-4 text-white bg-[#1d1d1d] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search..."
        />
        
        {/* <select
          className='mx-1 p-4 text-white bg-[#1d1d1d] rounded-r-full focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={category}
          onChange={handleCategoryChange}
        >
          <option value='song'>Song</option>
          <option value='artist'>Artist</option>
        </select> */}
        
        <button
          className='ml-4 px-6 py-4 text-white bg-blue-800 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800'
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
