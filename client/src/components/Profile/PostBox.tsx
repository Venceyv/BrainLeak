import React, { useState } from 'react'

function PostBox() {

  const [createPost, setCreatePost] = useState(true);
  const [posts, setPosts] = useState(false);
  const [topics, setTopics] = useState(false);
  const [followedPost, setFollowedPost] = useState(false);

  const createPostHandler = () =>  {
    setCreatePost(true);
    setPosts(false);
    setTopics(false);
    setFollowedPost(false);
  };
  const postsHandler = () =>  {
    setCreatePost(false);
    setPosts(true);
    setTopics(false);
    setFollowedPost(false);
  };
  const topicsHandler = () =>  {
    setCreatePost(false);
    setPosts(false);
    setTopics(true);
    setFollowedPost(false);
  };
  const followedpostHandler = () =>  {
    setCreatePost(false);
    setPosts(false);
    setTopics(false);
    setFollowedPost(true);
  };
  
  return (
    <div className="inline-flex w-3/4 ml-80 h-3/4">
      
      <div className="pr-3 pt-3 h-4/5 w-48">
        <div className="rounded-sm border-2 border-black flex p-2 h-3/4 bg-neutral-800 text-white	">
          <div className="relative text-center align-middle pl-2 pt-8 ">
            <button onClick={createPostHandler} className="text-xl font-bold">Create Post</button>
            <div className = "pt-20">
              <button onClick={postsHandler}>My Posts</button>
              <div className = "pt-4">
                <button onClick={topicsHandler}>Followed Topics</button>
                <div className = "pt-4">
                  <button onClick={followedpostHandler}>Followed Posts</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 h-9/10 w-11/12">
        <div className="flex h-3/5 w-3/4 rounded-md border-4 border-black p-2 bg-neutral-800 text-white	">
          {createPost && (
            <p>Post: </p>
          )}
          {posts && (
            <p>My Posted Posts</p>
          )}
          {topics && (
            <p>My Followed Topics</p>
          )}
          {followedPost && (
            <p>My Followed Posts</p>
          )}
        </div>
      </div>
    </div>
  ) 
}

export default PostBox