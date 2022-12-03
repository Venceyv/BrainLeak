import { useEffect, useState } from 'react'
import axios from 'axios'


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
  
    //Fetching Data Through Axios
    const [postApi, setPostApi] = useState([])
  
    const fetchPosts = () => {
      axios.get("https://jsonplaceholder.typicode.com/posts").then(response => {
        setPostApi(response.data)
      })
    }

    const [users, setUsers] = useState([])
  
    const fetchUsers = () => {
      axios.get("https://jsonplaceholder.typicode.com/users").then(response => {
        setUsers(response.data)
      })
    }
  
    useEffect(() => {
      fetchUsers();
      fetchPosts();
    }, [])

  return (
    <div className="pt-3 flex w-7/12 h-3/4 ml-auto mr-auto">
      <div className="pr-3 h-4/5 w-[298px] space-y-4 ">
        <div className="max-w-[298px] max-h-[232px] rounded-lg relative text-center align-middle pl-2 pt-8 border-2 border-black  p-2 h-1/2 bg-neutral-800 text-white	flex flex-col">
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
          <div className="m-auto max-w-[256px] max-h-[232px] justify-center rounded-lg relative pl-2 pt-8 border-2 border-black flex p-2 h-1/2 bg-neutral-800 text-white	">
              <div className="space-y-4 flex flex-col">
                <div>
                  <p>Subscriber Count: {users[1]?.id}</p>
                  {/* <p>Sub Count:</p> */}
                </div>
                <div>
                  <p>Posts: {users[2]?.id}</p>
                  {/* <p>Posts:</p> */}
                </div>
                <div>
                  <p>Likes: {users[4]?.address?.zipcode}</p>
                  {/* <p>Likes:</p> */}
                </div>
                <div>
                  <p>Comments: {users[8]?.id}</p>
                  {/* Comments: */}
                </div>
              </div>
          </div>


      </div>
      {/* Set Max Width to 1024px  */}
      {/* Main Post Container */}
      <div className="h-[483px] content-center w-full">
        <div className="max-w-[1024px] min-h-full flex rounded-md border-4 border-black p-2 bg-neutral-800 text-white mr-1.5">
          <div className="w-full">
          {profileDesc && (
            <div className="">
              <div className="text-center mb-5 mt-2">
                <p>Welcome to your Profile Page</p>
              </div>
              <div className="">
                <p className="border-white border-2 p-2 mb-5 rounded-lg">{users[0]?.company?.catchPhrase}</p>
              </div>
            </div>
          )}  
          {posts && (
            <p className="border-white border-2 p-2 mb-5 rounded-lg">{users[0]?.email}</p>
            // <p>My Posts Temp</p>
          )}
          {topics && postApi?.length > 0 && (
            <ul>
              {postApi.map(post => (
              <li className="border-white border-2 p-2 mb-5 rounded-lg" key={post.id}>{post.body}</li> 
              ))}
            </ul>
            // {topics && ( 
            // <p>Comment History Temp</p>
          )}
          {followedPost && (
            <p className="border-white border-2 p-2 mb-5 rounded-lg">{users[2]?.email}</p>
            // <p>Liked Posts Temp</p>
          )}
          </div>
        </div>
      </div>
    </div>
  ) 
}

export default PostBox