import { useEffect, useState } from 'react'
import axios from 'axios'
import {useQuery} from 'react-query'


function PostBox() {
  
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
  
  // const [postsAPI, setPostsAPI] = useState([]); 
  // const [postContent, setPostContent] = useState([]);

  // const fetchPosts = () => {
  //   fetch("https://jsonplaceholder.typicode.com/users").then(response => response.json()).then((json) => setPostsAPI(json));
  // }
  // const fetchPost = () => {
  //   fetch("https://jsonplaceholder.typicode.com/posts?userId=10").then(response => response.json()).then((json) => setPostContent(json));
  // }

  // useEffect(() => {
  //   fetchPosts();
  //   fetchPost();
  // })

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

        {/* Container For Trackers, ie # of Posts */}
          <div className="justify-center rounded-lg relative pl-2 pt-8 border-2 border-black flex p-2 h-1/2 bg-neutral-800 text-white	">
              <div className="space-y-3 flex flex-col">
                <div>
                  {/* <p>Subscriber Count: {postsAPI[1]?.id}</p> */}
                  <p>Sub Count:</p>
                </div>
                <div>
                  {/* <p>Posts: {postsAPI[2]?.id}</p> */}
                  <p>Posts:</p>
                </div>
                <div>
                  {/* <p>Likes: {postsAPI[4]?.address?.zipcode}</p> */}
                  <p>Likes:</p>
                </div>
                <div>
                  {/* <p>Comments: {postsAPI[8]?.id}</p> */}
                  Comments:
                </div>
              </div>
          </div>


      </div>

      {/* Main Post Container */}
      <div className="content-center h-full w-full">
        <div className="overflow-y-auto flex justify-center h-full rounded-md border-4 border-black p-2 bg-neutral-800 text-white mr-1.5">
          <div className="">
          {profileDesc && (
            <div>
              <div className="">
                <p>Welcome to your Profile Page</p>
              </div>
              <div>
                {/* <p>{postsAPI[0]?.company?.catchPhrase}</p> */}
              </div>
            </div>
          )}  
          {posts && (
            // <p>{postsAPI[0]?.email}</p>
            <p>My Posts Temp</p>
          )}
          {topics && /*postContent?.length > 0 && */(
            // <ul>
            //   {postContent.map(post => (
            //   <li className="border-white border-4 p-2 mb-5" key={post?.id}>{post?.body}</li> 
            //   ))}
            // </ul>
            <p>Comment History Temp</p>
          )}
          {followedPost && (
            // <p>{postsAPI[2]?.email}</p>
            <p>Liked Posts Temp</p>
          )}
          </div>
        </div>
      </div>
    </div>
  ) 
}

export default PostBox