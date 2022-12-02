import Header from "../components/Profile/Header";
import PostBox from "../components/Profile/PostBox";
import { useState } from "react";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";



const queryClient = new QueryClient()

const home = () => {

    return (
      <>
        
      <Header />
      <PostBox />

      </>
    );
  };
  
  export default home;