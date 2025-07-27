import { create } from 'zustand';

// Your Spotify credentials
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

export const useAppStore = create((set, get) => ({
  // --- State ---
  accessToken: null,
  searchResults: [],
  isLoading: false,
  error: null,
  
  // New state for the song details page
  currentSong: null,
  isLoadingDetails: false,
  songDetailsCache: {}, // Cache to avoid re-fetching

  // --- Actions ---
  getAccessToken: async () => {
    // Avoid re-fetching if token already exists
    if (get().accessToken) return get().accessToken;

    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
      },
      body: 'grant_type=client_credentials',
    };
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
      if (!response.ok) throw new Error('Failed to get access token');
      const data = await response.json();
      set({ accessToken: data.access_token });
      return data.access_token;
    } catch (error) {
      console.error('Authentication Error:', error);
      set({ error: 'Authentication failed.' });
      return null;
    }
  },

  fetchSearchResults: async (query) => {
    set({ isLoading: true, error: null });
    const token = await get().getAccessToken();
    if (!token) return; // Exit if no token

    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, searchParameters);
      if (!response.ok) throw new Error('Failed to fetch search results.');
      const data = await response.json();
      set({ searchResults: data.tracks.items, isLoading: false });
    } catch (error) {
      console.error('Search Error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ NEW ACTION: Fetches details for a single song
  fetchSongDetails: async (songId) => {
    // 1. Check cache first
    if (get().songDetailsCache[songId]) {
      set({ currentSong: get().songDetailsCache[songId] });
      return;
    }

    set({ isLoadingDetails: true, error: null, currentSong: null });
    const token = await get().getAccessToken();
    if (!token) return;

    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    try {
      const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, searchParameters);
      if (!response.ok) throw new Error('Failed to fetch song details.');
      const data = await response.json();
      
      // 2. Save to cache and set as current song
      set(state => ({
        songDetailsCache: { ...state.songDetailsCache, [songId]: data },
        currentSong: data,
        isLoadingDetails: false
      }));
    } catch (error) {
      console.error('Song Details Error:', error);
      set({ error: error.message, isLoadingDetails: false });
    }
  },
}));
