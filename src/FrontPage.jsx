import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import { dataEminem } from '../dummySearchData';

const FrontPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState('song');
  const dummyData = dataEminem;
  // const [results, setResults] = useState(dummyData.tracks.items.slice(0, 10));
  const [results, setResults] = useState([]);
  const [songData,setSongData] = useState([])

  // this is dummy fxn,
  // comment this out when running acutal API call
  // useEffect(() => {
  //   if (query !== "") {
  //     setResults(dummyData.tracks.items.slice(0, 10)); 
  //   }
  // }, [query, category]);


  /****
   * 
   * Everything working properly here, only need to use dummy data and pass on to fix things there
   */



  useEffect(() => {
    const getMusic = async (queryName, queryCategory ) => {
      
      const type = queryCategory === 'song'  ? "tracks" : "artist";
      const url = `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(queryName)}&type=${type}&offset=${0}&limit=${100}&numberOfTopResults=5`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_API_URL,
          'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
      }

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        setSongData(result); // store all data into songData
        setResults(result.tracks.items.slice(0,5));
        console.log(result)
      } catch (error) {
        console.error(error);
      }

    };
    
    if(query) getMusic(query, category);
  }, [query, category]);


  const handleSearch = (q, cat) => {
    setQuery(q);
    setCategory(cat);
  };

  const showMoreResults = () => {
    const len = songData.tracks.items.length;
    const newLen = (results.length + 5) <= len ? results.length + 5 : len;
    setResults(songData.tracks.items.slice(0, newLen));
  };

  return (
    <div 
      className='w-full min-h-screen bg-gradient-to-b from-[#367c50] to-[#121212] text-white p-6'
    >
      <div className='flex flex-col items-center justify-center text-center'>
        <h1 className='text-4xl font-bold mb-6'>
          Find out about your favourite artists and songs
        </h1>
        <SearchBar onSearch={handleSearch} />
        {query && (
          <div className='mt-6'>
            {results && results.length ? (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>

                {/* display data of each track, map each object to a div */}
                {results.map((item, index) => (
                  <Link 
                    to={`/songInfo/${item.data.id}`}
                    key={index}
                    className='block bg-black rounded-3xl overflow-hidden transition-transform transform hover:scale-105'
                  >
                    <div className='flex flex-col items-center p-4'>
                      <img 
                        className='w-full h-32 object-cover rounded-full mb-2' 
                        src={item.data.albumOfTrack.coverArt.sources[1].url} 
                        alt="Art"
                      />
                      <p className='text-center font-semibold'>{item.data.name}</p>
                      <p className='text-slate-400 underline'>{item.data.artists.items[0].profile.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className='text-white'>No data available</p>
            )}
            <button 
              className='mt-6 px-5 py-2 bg-green-600 rounded-full text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-800'
              onClick={showMoreResults}
            >
              Show More Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FrontPage;





  