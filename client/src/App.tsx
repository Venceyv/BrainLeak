import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { Layout } from './layouts/layout';
import './App.css';
import { Post } from './pages/Post';
import { Search } from './pages/Search';
import { Test } from './Test';

const App: FC = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />}>
            <Route path="post/:postId" element={<Post />} />
          </Route>

          {/* <Route path="profile" element={<div>IP</div>} /> */}
          <Route path="test" element={<Test />} />
          <Route path="search/:searchParam" element={<Search />} />
        </Route>

        {/* <Route path="/1" element={<NavBar />} /> */}

        {/* <Route path="*" element={<div>IP</div>} /> */}
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
