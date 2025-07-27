import React, { useEffect } from 'react';
import { useAppStore } from './store/store';
import SearchBar from './components/SearchBar';
import { Link } from 'react-router-dom';
import CardSkeleton from './components/CardSkeleton';

function App() {
  const {
    accessToken,
    getAccessToken,
    searchResults,
    isLoading,
    error,
    fetchSearchResults,
  } = useAppStore();

  useEffect(() => {
    if (!accessToken) {
      getAccessToken();
    }
  }, [getAccessToken, accessToken]);

  const handleSearch = (query) => {
    fetchSearchResults(query);
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen p-6">
      <div className="container mx-auto flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold mt-6">Search your favourite songs and artists</h1>
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-8 w-full max-w-4xl">
          {isLoading && ( // while loading show skeleton
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {[...Array(10)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}
          {error && <p className="text-red-400">Error: {error}</p>}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {!isLoading && !error && searchResults.map((track) => (
              <Link to={`/song/${track.id}`} key={track.id}>
                <div className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors">
                  <img 
                    src={track.album.images[0]?.url} 
                    alt={track.name}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <h3 className="font-bold mt-2 truncate">{track.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{track.artists[0].name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;