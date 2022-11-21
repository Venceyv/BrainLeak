import { FC, Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from './pages/home';
import { Layout } from './layouts/layout';
import { Test } from './Test';
import './App.css';
import { NavBar } from './feature/NavBar';

const App: FC = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post" element={<div>IP</div>} />
          <Route path="profile" element={<div>IP</div>} />
          <Route path="search" element={<div>IP</div>} />
        </Route>

        {/* <Route path="/1" element={<NavBar />} /> */}

        <Route path="*" element={<div>IP</div>} />
      </Routes>
      {/* <Routes>
        <Route path="/login" element={<Login />} />
      </Routes> */}
      {/* <Navbar />
      <div className="grid items-center w-full h-[calc(100%-56px)] bg-primary-black text-white">
        <Posts />
      </div> */}
    </>
  );
};

export default App;
