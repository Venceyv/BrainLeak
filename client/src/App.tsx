import { useState } from 'react';
// import {GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  // const login = useGoogleLogin({
  //   onSuccess: tokenResponse => console.log(tokenResponse),
  // });

  const googleLogin = useGoogleLogin({
    onSuccess: async ( {code} ) => {
      console.log(code)
      const tokens = await axios.post('http://localhost:3001/auth/google', 
        // http://localhost:3001/auth/google
       {code} ,
    );
    
      console.log(tokens);
    },
    onError: async (err) => {console.log(err)},
    flow: 'auth-code',
  });

  return (
    <>
      {/* <GoogleLogin 
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => console.log('Login via google failed.')}/> */}
      <button onClick={() => googleLogin()}>Sign in with Google 🤞</button>
    </>
  );
}

export default App;
