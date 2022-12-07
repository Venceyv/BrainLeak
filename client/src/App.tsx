import { FC, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { Layout } from "./layouts/layout";
import { Loading } from "./components/Loading";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Post = lazy(() => import("./pages/Post"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const Search = lazy(() => import("./pages/Search"));
const RouteNotFound = lazy(
  () => import("./components/RouteNotFound")
);
const Unauthorized = lazy(() => import("./components/Unauthorized"));
const Profile = lazy(() => import("./pages/Profile"));

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
            <Route path="user/profile/:userId" element={<Profile />}>
              <Route path="my-posts" />
              <Route path="liked-posts" />
              <Route path="bookmarked-posts" />
              <Route path="comment-history" />
            </Route>
            <Route
              path="user/notification/:userId"
              element={<Profile />}
            />
            <Route path="search/*" element={<Search />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<RouteNotFound />} />
          </Route>

          <Route path="/1" element={<Test />} />

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
