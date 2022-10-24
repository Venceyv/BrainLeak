import { FC, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Posts, Login } from './components';
import Home from './pages/Home';
import { Layout } from './layouts/Layout';
import './App.css';

const App: FC = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* <Route path="*" element={<PageNotFound/>} /> */}
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
