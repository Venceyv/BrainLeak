import { useState } from 'react'

function PostBox({profileInfo, myPosts, myFollowedTopics, myFollowedPosts, subCount, numPosts, numLikes, numComments}) {

  const [profileDesc, setProfileDesc] = useState(true);
  const [posts, setPosts] = useState(false);
  const [topics, setTopics] = useState(false);
  const [followedPost, setFollowedPost] = useState(false);

  const descHandler = () =>  {
    setProfileDesc(true);
    setPosts(false);
    setTopics(false);
    setFollowedPost(false);
  };
  const postsHandler = () =>  {
    setProfileDesc(false);
    setPosts(true);
    setTopics(false);
    setFollowedPost(false);
  };
  const topicsHandler = () =>  {
    setProfileDesc(false);
    setPosts(false);
    setTopics(true);
    setFollowedPost(false);
  };
  const followedpostHandler = () =>  {
    setProfileDesc(false);
    setPosts(false);
    setTopics(false);
    setFollowedPost(true);
  };
  
  return (
    <div className="pt-3 inline-flex w-7/12 h-3/4 ml-80">
      <div className="pr-3 h-4/5 w-1/3 space-y-4">
        <div className="rounded-lg relative text-center align-middle pl-2 pt-8 border-2 border-black  p-2 h-1/2 bg-neutral-800 text-white	flex flex-col">
          <div className="text-lg font-bold">
            <button onClick={descHandler}> &#8226; Profile &#8226;</button>
          </div>
          <div className = "pt-4">
            <button onClick={postsHandler}> &#8226; My Posts &#8226;</button>
          </div>
          <div className = "pt-4">
            <button onClick={topicsHandler}> &#8226; Comment History &#8226;</button>
          </div>
          <div className = "pt-4">
            <button onClick={followedpostHandler}> &#8226; Liked Posts &#8226;</button>
          </div>
        </div>
          <div className="justify-center rounded-lg relative pl-2 pt-8 border-2 border-black flex p-2 h-1/2 bg-neutral-800 text-white	">
              <div className="space-y-3 flex flex-col">
                <div>
                  <p>Subscriber Count: {subCount}</p>
                </div>
                <div>
                  <p>Posts: {numPosts}</p>
                </div>
                <div>
                  <p>Likes: {numLikes}</p>
                </div>
                <div>
                  <p>Comments: {numComments}</p>
                </div>
              </div>
          </div>
      </div>


      <div className="content-center h-5/6 w-full">
        <div className="flex justify-center h-full rounded-md border-4 border-black p-2 bg-neutral-800 text-white mr-1.5">
          <div className="">
          {profileDesc && (
            <div>
              <div className="">
                <p>Welcome to your Profile Page</p>
              </div>
              <div>
                <p>{profileInfo}</p>
              </div>
            </div>
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
    </div>
  ) 
}

export default PostBox