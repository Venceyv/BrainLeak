import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { errorToast } from './utils/errorToast';
import { CLIENT_ID } from './data/Constants';
import App from './App';

import './index.css';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err === 'not author') return;
      errorToast();
    },
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <App />
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
