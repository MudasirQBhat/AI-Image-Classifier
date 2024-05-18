import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl'; // Import WebGL backend

// Initialize the WebGL backend
tf.setBackend('webgl').then(() => {
  console.log('WebGL backend initialized successfully');
  // Render the React app using createRoot
  const root = createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(err => {
  console.error('Error initializing WebGL backend:', err);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
