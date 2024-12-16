import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ensure this is pointing to your App component
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '623077210535-p5840ajm4rs63munfqegs50r7fh20nb6.apps.googleusercontent.com';  // Make sure you put the correct Client ID here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
