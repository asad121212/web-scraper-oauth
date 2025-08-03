import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Create the root of the React application and render the main App component
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App in GoogleOAuthProvider to enable Google Login across the app */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
  </StrictMode>
);
