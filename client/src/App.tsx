import { FC, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './layouts/layout';
import { Loading } from './components/Loading';
import { Test } from './Test';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Post = lazy(() => import('./pages/Post'));
const NewPost = lazy(() => import('./feature/NewPost'));
const Search = lazy(() => import('./pages/Search'));

const App: FC = (): JSX.Element => {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-full w-full bg-secondary-black">
            <Loading height="full" width="full" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />}>
              <Route path="post/:postId" element={<Post />} />
            </Route>

            {/* <Route path="profile" element={<div>IP</div>} /> */}
            <Route path="test" element={<Test />} />
            <Route path="new-post" element={<NewPost />} />
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
      </Suspense>
    </>
  );
};

export default App;
