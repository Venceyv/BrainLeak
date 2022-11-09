import Header from "../components/Profile/Header";
import PostBox from "../components/Profile/PostBox";
import { useState } from "react";

const home = () => {

  /*const [followers, setFollowers] = useState([
    { follower: 2, following: 5 }
   ]);
  */

   const [postBox, setPostBox] = useState([
    { profileInfo: "PROFILE DESCRIPTION TEMP", myPosts: "USER POSTS placeholder", myFollowedTopics: "COMMENT HISTORY PLACEHOLDER", myFollowedPosts: "LIKED POSTS PLACEHOLDER", subCount: 999, postCount: 888, likeCount: 777, commentCount: 666}
   ]);
   
    return (
      <>

        {/*followers.map(follow => (
          <Header follower={follow.follower} following={follow.following} />
        ))*/}
        <Header />

       {postBox.map(post => (
          <PostBox profileInfo={post.profileInfo} myPosts={post.myPosts} myFollowedTopics={post.myFollowedTopics} myFollowedPosts={post.myFollowedPosts} subCount={post.subCount} numPosts={post.postCount} numLikes={post.likeCount} numComments={post.commentCount} />
       ))}


      </>
    );
  };
  
  export default home;