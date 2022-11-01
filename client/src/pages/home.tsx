import Header from "../components/Profile/Header";
import Hero from "../components/Profile/Hero";
import PostBox from "../components/Profile/PostBox";
import { useState } from "react";

const home = () => {

  const [followers, setFollowers] = useState([
    { follower: 2, following: 5 }
   ]);

   const [postBox, setPostBox] = useState([
    { myPosts: "USER POSTS placeholder", myFollowedTopics: "Followed TOPICS Placeholder", myFollowedPosts: "Followed POSTS Placeholder"}
   ]);
   
    return (
      <>

        <Hero />

        {followers.map(follow => (
          <Header follower={follow.follower} following={follow.following} />
        ))}

       {postBox.map((post => 
          <PostBox myPosts={post.myPosts} myFollowedTopics={post.myFollowedTopics} myFollowedPosts={post.myFollowedPosts}/>
       ))}

        {/*<PostBox /> */}

      </>
    );
  };
  
  export default home;