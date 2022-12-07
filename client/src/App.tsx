import { FC, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './layouts/layout';
import { Loading } from './components/Loading';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Post = lazy(() => import('./pages/Post'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Search = lazy(() => import('./pages/Search'));
const RouteNotFound = lazy(
  () => import('./components/RouteNotFound')
);
const Unauthorized = lazy(() => import('./components/Unauthorized'));
const Profile = lazy(() => import('./pages/Profile'));
const EditPost = lazy(() => import('./pages/EditPost'));
const MyPosts = lazy(
  () => import('./feature/UserProfileCatalog/MyPosts')
);
const MyBookmarked = lazy(
  () => import('./feature/UserProfileCatalog/MyBookmarked')
);
const MyLiked = lazy(
  () => import('./feature/UserProfileCatalog/MyLiked')
);
const MyComment = lazy(
  () => import('./feature/UserProfileCatalog/MyComment')
);

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
            <Route path="new-post" element={<CreatePost />} />
            <Route path="post/edit/:postId" element={<EditPost />} />
            <Route path="user/profile/:userId" element={<Profile />}>
              <Route path="my-posts" element={<MyPosts />} />
              <Route path="liked-posts" element={<MyLiked />} />
              <Route
                path="bookmarked-posts"
                element={<MyBookmarked />}
              />
              <Route path="comment-history" element={<MyComment />} />
            </Route>
            <Route
              path="user/:userId/notifications"
              element={<Profile />}
            />
            <Route path="search/*" element={<Search />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<RouteNotFound />} />
          </Route>

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
