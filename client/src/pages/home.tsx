import Header from "../components/Profile/Header";
import Hero from "../components/Profile/Hero";
import PostBox from "../components/Profile/PostBox";
import { useState } from "react";

const home = () => {

  const [followers, setFollowers] = useState([
    { follower: 2, following: 5 }
   ]);
   
    return (
      <>
        <Hero />

        {followers.map(follow => (
          <Header follower={follow.follower} following={follow.following} />
        ))}

        <PostBox />
      </>
    );
  };
  
  export default home;