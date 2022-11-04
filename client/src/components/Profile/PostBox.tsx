import React, { useState } from 'react'

function PostBox({myPosts, myFollowedTopics, myFollowedPosts}) {

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
    <div className="inline-flex w-7/12 h-3/4 ml-80">
      
      <div className="pr-3 h-4/5 w-52">
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

      <div className="content-center h-5/6 w-full">
        <div className="flex justify-center h-full rounded-md border-4 border-black p-2 bg-neutral-800 text-white mr-1.5">
          {createPost && (
            <form className="mt-4 w-11/12 h-full">
              <div className="flex">
                <label className="">Post:</label>
                <input className="ml-auto" type="submit" value="Leak"></input>
                <br></br>
              </div>
                <div className="h-5/6 flex">
                  <textarea placeholder="Write Post Here.." className="resize-none box-border text-start border-2 border-white rounded-md w-full h-full bg-neutral-800 text-white"></textarea>
                </div>
            </form>
          )}
          {posts && (
            <p>{myPosts}</p>
            //<p>My Posts Temp</p>
          )}
          {topics && (
            <p>{myFollowedTopics}</p>
            //<p>Followed Topics Temp</p>
          )}
          {followedPost && (
            <p>{myFollowedPosts}</p>
            //<p>Followed Posts Temp</p>
          )}
        </div>
      </div>
    </div>
  ) 
}

export default PostBox