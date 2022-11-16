import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import App from './App';

import './index.css';

const errorToast = () =>
  toast.error('Oops! Something went wrong', {
    style: {
      border: '2px solid white',
      background: '#181818',
      color: 'white',
    },
    position: 'top-right',
  });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: () =>
        toast.custom(<div className="text-primary-black bg-white ">Oops! Something went wrong</div>, { position: 'top-center' }),
    },
    mutations: {
      onError: (error: any) => toast.error(`Oops! Something went wrong: ${error.message}`),
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId="324694170288-njdv09i6kjhpoicc03c8tonqnrd914ps.apps.googleusercontent.com">
          <App />
          <button type="button" onClick={errorToast}>
            Toast
          </button>
          <Toaster
            containerStyle={{
              top: 60,
            }}
          />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
