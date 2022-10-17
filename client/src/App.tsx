import { FC, Suspense, lazy } from 'react';
import { Navbar } from './components';
import {Posts} from './components';
import { Routes, Route } from 'react-router-dom';

import './App.css';

const App:FC = (): JSX.Element => {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Navbar />} >
        {/* <Route index element={Home}/> */}
      </Route>
      {/* <Route path="*" element={<PageNotFound/>} /> */}
    </Routes>
      <Navbar />
      <div className="grid items-center w-full h-[calc(100%-56px)] bg-primary-black text-white">
        <Posts />
      </div>
    </>
  );
};

export default App;
