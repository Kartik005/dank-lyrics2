import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { songWithoutMe } from '../../dummySearchData';
import { lyricsWithoutMe } from '../../dummySearchData';
const SongInfo = () => {

  // everything working great, only the lyrics aren't being updated as they should
  // 3syqe1nnZ4eHjhsc0qM5UW
  const { id } = useParams();
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState(lyricsWithoutMe);
  const [song, setSong] = useState(songWithoutMe);
  
  
  useEffect(() => {
    const trackData = async () => {
      const url = `https://spotify-scraper.p.rapidapi.com/v1/track/metadata?trackId=${id}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_API_URL,
          'x-rapidapi-host': 'spotify-scraper.p.rapidapi.com'
        }
      };
  
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        setSong(result);
      } catch (error) {
        console.error(error);
      }
    };
  
  
  
    const getLyrics = async ()=>{
      const url = `https://spotify-scraper.p.rapidapi.com/v1/track/lyrics?trackId=${id}&format=json`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_API_URL,
          'x-rapidapi-host': 'spotify-scraper.p.rapidapi.com'
        }
      };
      
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        setLyrics(result);
        console.log(result)
      } catch (error) {
        console.error(error);
      }
    }

    trackData();
    getLyrics();
  }, [id]);
  

  return (
    <div 
      className='w-full h-screen flex flex-col items-center text-white overflow-y-auto'
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.7) 60%, #121212 100%), url(${
        lyrics.message ? songWithoutMe.album.cover[1].url : // show placeholder image when not loading
        song.album.cover[1].url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      <Link 
    to="/" 
    className='m-6 px-5 py-2 text-white bg-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-800 hover:bg-gray-200 transition hover:text-green-500'
  >
    Go Home
  </Link>
      <div className='w-full max-w-4xl p-8 bg-opacity-80 bg-[#121212] rounded-lg shadow-lg'>
        <div className='flex flex-col lg:flex-row lg:items-center'>
          <img
            className='w-full max-w-xs rounded-lg shadow-md lg:w-1/3'
            src={ lyrics.message ? songWithoutMe.album.cover[1].url : song.album.cover[1].url}
            alt={song.name}
          />
          <div className='lg:ml-8 mt-6 lg:mt-0'>
            <h1 className='text-4xl font-bold mb-4'>{ lyrics.message ? songWithoutMe.name : song.name}</h1>
            <h2 className='text-2xl font-semibold mb-2'>Album: { lyrics.message ? songWithoutMe.album.name :song.album.name}</h2>
            <p className='mb-4'>Play Count: {lyrics.message ? songWithoutMe.playCount.toLocaleString() : song.playCount.toLocaleString()}</p>
            <div className='mb-4'>
              <h3 className='text-xl font-semibold mb-2'>Artist(s):</h3>
              <ul className='list-disc pl-5'>
                {song.artists.map((artist, index) => (
                  <li key={index} className='mb-1'>{ lyrics.message ? songWithoutMe.artists[0].name : artist.name}</li>
                ))}
              </ul>
            </div>
            <a href={lyrics.message ? songWithoutMe.shareUrl :song.shareUrl}
              className='inline-block px-4 py-2 mt-4 text-sm font-semibold text-[#121212] bg-white rounded-lg hover:bg-gray-200 transition'
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen on Spotify
            </a>
            <a href={ lyrics.message ? songWithoutMe.album.shareUrl : song.album.shareUrl}
              className=' mx-4 inline-block px-4 py-2 mt-4 text-sm font-semibold text-[#121212] bg-white rounded-lg hover:bg-gray-200 transition'
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Album
            </a>
          </div>
        </div>
      </div>

      <button 
        className='inline-block px-4 py-2 mt-4 text-sm font-semibold text-[#121212] bg-white rounded-lg hover:bg-gray-200 transition'
        onClick={() => setShowLyrics(!showLyrics)}
      >
        {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
      </button>

      {/* Display Lyrics if showLyrics is true */}
      {showLyrics && (
        <div className='mt-6 w-full max-w-3xl text-center bg-[#1d1d1d] rounded-3xl p-6'>
          {/* if error message, show no lyrics else show something */}
          { lyrics.message ? <p>No lyrics available</p>
           : lyrics.map((line, index) => (
            <p key={index} className='mb-4 text-lg'>{line.text}</p>
          ))}
        </div>
      )}

    </div>
  );
};

export default SongInfo;


