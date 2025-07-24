import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { useAppStore } from '../store';

const CardSkeleton = () => (
  <div className='block bg-gray-800 rounded-3xl p-4 animate-pulse'>
    <div className='flex flex-col items-center'>
      <div className='w-full h-auto aspect-square bg-gray-700 rounded-2xl mb-4'></div>
      <div className='h-4 bg-gray-700 rounded w-3/4 mb-2'></div>
      <div className='h-3 bg-gray-700 rounded w-1/2'></div>
    </div>
  </div>
);

const FrontPage = () => {
  // Get state and actions directly from the global store
  const {
    query,
    results,
    isLoadingSearch,
    searchError,
    fetchSearchResults,
    setSearchQuery,
  } = useAppStore();

  const handleSearch = (q, cat) => {
    // Update query in the store and trigger the fetch
    setSearchQuery(q, cat);
    fetchSearchResults(q, cat);
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-[#367c50] to-[#121212] text-white p-6'>
      <div className='flex flex-col items-center justify-center text-center max-w-screen-xl mx-auto'>
        <h1 className='text-4xl font-bold mb-6'>Find out about your favourite artists and songs</h1>
        <SearchBar onSearch={handleSearch} initialQuery={query} />

        <div className='mt-8 w-full'>
          {isLoadingSearch && (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {[...Array(10)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {searchError && <p className='text-red-400 text-lg'>{searchError}</p>}
          
          {!isLoadingSearch && !searchError && results.length > 0 && (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {results.map((item) => (
                <Link
                  to={`/songInfo/${item.data.id}`}
                  key={item.data.id}
                  className='block bg-black/50 rounded-3xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-black/80'
                >
                  <div className='flex flex-col items-center p-4'>
                    <img
                      className='w-full h-auto aspect-square object-cover rounded-2xl mb-4 shadow-md'
                      src={item.data.albumOfTrack.coverArt.sources[0].url}
                      alt={`Album art for ${item.data.name}`}
                    />
                    <p className='text-center font-semibold truncate w-full'>{item.data.name}</p>
                    <p className='text-sm text-slate-400 truncate w-full'>{item.data.artists.items[0].profile.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!isLoadingSearch && query && results.length === 0 && !searchError && (
             <p className='text-slate-300'>No results found for "{query}".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontPage;