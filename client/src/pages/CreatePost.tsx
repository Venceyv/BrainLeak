import React, { useRef, useState } from "react";

let profile = {
  name: "HelloKitty",
  posts: 356,
  comments: 900,
  likes: 2929,
  subscribers: 30,
};

let list = [
  {
    user: "byeKitty",
    likes: 343,
  },
  {
    user: "nexon",
    likes: 23,
  },
  {
    user: "mapleStory",
    likes: 343,
  },
];

const CreatePost: React.FC = () => {
  return (
    <>
      <div className="bg-secondary-black w-full flex justify-center  h-screen pt-4">
        {/* form */}
        <div className="w-2/6 h-5/6 border bg-primary-black border-white ">
          {" "}
          <h2 className="text-white">Create a Post</h2>
          <div className="flex justify-center">
            <div className=" w-5/6 ">
              <form id="createPost">
                <input
                  className="bg-secondary-black text-white w-full caret-white border border-white mt-4"
                  type="text"
                  id="title"
                  placeholder="Title..."
                  name="title"
                ></input>
                <textarea
                  className="w-full bg-secondary-black caret-white text-xs text-white border border-white mt-8 resize-none overflow-y-auto"
                  id="post"
                  rows={18}
                  name="textarea"
                  placeholder="Create a post..."
                ></textarea>
                <div className="flex justify-between">
                  <div className="flex">
                    <p className="text-white text-md">Add tags: </p>
                    <button className="text-white text-sm border border-white w-12 rounded ml-2">
                      +
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button
                      id="reset"
                      className="text-white text-sm border border-white w-12 rounded "
                      name="reset"
                    >
                      Reset
                    </button>
                    <button
                      id="post"
                      type="submit"
                      className="text-white text-sm border border-white w-12 rounded ml-4"
                    >
                      Post
                    </button>
                  </div>
                </div>
                <div className="flex mt-4">
                  <button className="text-white text-sm border border-white w-12 rounded ">
                    Game
                  </button>
                  <button className="text-white text-sm border border-white w-12 rounded ml-4">
                    Funny
                  </button>
                  <button className="text-white text-sm border border-white w-12 rounded ml-4">
                    Meme
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* you profile and other users  */}
        <div
          id="outer"
          className="  bg-primary-black w-1/6 h-5/6  flex  justify-center"
        >
          <div className="border border-white h-1/3 rounded-lg w-3/4 ">
            <div className="flex justify-center h-2/4">
              <div className=" border border-white flex flex-wrap mt-2 w-11/12 h-7/8 rounded-lg">
                <img
                  className="w-4 h-4 rounded-full border-[1px] cursor-pointer border-white mt-2 ml-2"
                  src="/src/assets/img/testUserPic.jpeg"
                  alt="user"
                />
                <p className="text-white text-sm mt-2 ml-2 ">{profile.name}</p>
                <p className="basis-full text-xs text-white text-center mb-px">
                  Subscribers:{profile.subscribers}
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <div>
                <p className="text-xs text-white ">
                  <span>&#9830;</span>Post Count: {profile.posts}
                </p>
                <p className="text-xs text-white">
                  <span>&#9830;</span>Comment Count: {profile.comments}
                </p>
                <p className="text-xs text-white">
                  <span>&#9830;</span>Like Count: {profile.likes}
                </p>
              </div>
            </div>
          </div>
          {/* People similar to you */}
        </div>
      </div>
    </>
  );
};

export default CreatePost;
