import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SongInfo from './pages/SongInfo.jsx'; // We will create this file next
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Define the routes for our application
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/song/:songId', // This is a dynamic route for the song info page
    element: <SongInfo />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);