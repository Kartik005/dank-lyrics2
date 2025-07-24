import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/store';

const SongInfo = () => {
  const { songId } = useParams();
  
  const {
    currentSong,
    isLoadingDetails,
    fetchSongDetails,
    error,
  } = useAppStore();

  // --- State Hooks for Lyrics ---
  const [lyrics, setLyrics] = useState(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  // ✅ CORRECTED: This useEffect now ONLY fetches the main song details.
  useEffect(() => {
    fetchSongDetails(songId);
  }, [songId, fetchSongDetails]);

  // --- Lyrics Fetching Logic ---
  const getLyrics = async () => {
    if (lyrics) {
      return;
    }
    setIsLoadingLyrics(true);
    
    const url = `https://spotify-scraper.p.rapidapi.com/v1/track/lyrics?trackId=${songId}&format=json`;
    const options = {
      method: 'GET',
      headers: {
        // ❗️ Make sure this variable name matches your .env file
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'spotify-scraper.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (result.message) {
        throw new Error(result.message);
      }
      setLyrics(result);
    } catch (error) {
      console.error(error);
      setLyrics({ error: `Could not fetch lyrics. (${error.message})` });
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  // ✅ CORRECT: This function correctly calls getLyrics() on button click.
  const handleShowLyrics = () => {
    setShowLyrics(!showLyrics);
    if (!lyrics) {
      getLyrics();
    }
  };

  if (isLoadingDetails) {
    return <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white text-lg">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-[#121212] text-red-400">Error: {error}</div>;
  }
  if (!currentSong) {
    return <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">Song data not available.</div>;
  }

  const track = currentSong;
  const lyricsAvailable = Array.isArray(lyrics);

  return (
    <div className='relative w-full min-h-screen overflow-hidden bg-[#121212]'>
      {/* Background Effect */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${track.album.images[0]?.url})` }}
      >
        <div className="w-full h-full bg-black/70 backdrop-blur-xl backdrop-saturate-150"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-green-400 hover:underline mb-6 block">← Back to Search</Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column */}
            <div className="flex flex-col items-center">
              <img src={track.album.images[0]?.url} alt={track.name} className="w-full max-w-sm h-auto aspect-square rounded-lg shadow-2xl"/>
              <iframe title="Spotify Player" className="mt-6 rounded-xl w-full" src={`https://open.spotify.com/embed/track/${track.id}`} height="80" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>

            {/* Right Column */}
            <div className="text-center md:text-left flex flex-col justify-center">
              <div>
                <h1 className="text-5xl text-slate-200 font-bold">{track.name}</h1>
                <p className="text-2xl text-slate-300 mt-2">{track.artists.map(a => a.name).join(', ')}</p>
                <div className="text-lg text-slate-400 mt-4 space-y-1">
                  <p>Album: {track.album.name}</p>
                  <p>Popularity: {track.popularity} / 100</p>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                  <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2 bg-green-600 rounded-full font-bold hover:bg-green-700 transition-colors">Listen on Spotify</a>
                  <a href={track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-colors">Go to Album</a>
                  <button onClick={handleShowLyrics} className="px-5 py-2 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-colors">
                    {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lyrics Section */}
          {showLyrics && (
            <div className="mt-12 bg-black/30 p-8 rounded-lg backdrop-blur-sm">
              <h2 className="text-3xl text-slate-300 font-bold mb-4">Lyrics</h2>
              {isLoadingLyrics ? (
                <p className='text-slate-300'>Fetching lyrics...</p>
              ) : (
                lyricsAvailable ? (
                  lyrics.map((line, index) => (
                    <p key={index} className='text-slate-300 mb-2 text-lg'>{line.text}</p>
                  ))
                ) : (
                  <p className="text-slate-400">{lyrics?.error || 'No lyrics available for this song.'}</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongInfo;
