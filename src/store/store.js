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
  songDetailsCache: {},
  currentSong: null,
  isLoadingDetails: false,

  // --- Actions ---
  getAccessToken: async () => {
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
      return null;
    }
  },

  fetchSearchResults: async (query) => {
    set({ isLoading: true, error: null });
    let token = get().accessToken;
    if (!token) token = await get().getAccessToken();
    if (!token) {
      set({ error: 'Authentication failed.', isLoading: false });
      return;
    }
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

  fetchSongDetails: async (songId) => {
    if (get().songDetailsCache[songId]) {
      set({ currentSong: get().songDetailsCache[songId] });
      return;
    }
    set({ isLoadingDetails: true });
    let token = get().accessToken;
    if (!token) token = await get().getAccessToken();
    if (!token) {
      set({ error: 'Authentication failed.', isLoadingDetails: false });
      return;
    }
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
