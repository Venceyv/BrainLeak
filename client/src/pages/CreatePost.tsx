import React, { useState } from "react";

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
    subscribers: 34,
  },
  {
    user: "squidward",
    likes: 23,
    subscribers: 93,
  },
  {
    user: "mapleStory",
    likes: 343,
    subscribers: 56,
  },
];

const CreatePost: React.FC = () => {
  let [tag, setTag] = useState<string | null>(null);
  let [addTag, setaddTag] = useState<any>([]);
  let [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  //for images
  let [selectedFile, setSelectedFile] = useState<string>();
  // let [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    const newPost = {
      title: textInputs.title,
      body: textInputs.body,
    };
    try {
      //store the post in database
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
    }
  };

  const onSelectedImage = () => {};

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({ ...prev, [name]: value }));
  };

  let changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setTag(e.target.value);
  };
  let addTags = () => {
    const newTag = tag;
    if (addTag.length < 3) {
      setaddTag([...addTag, newTag]);
    }
  };

  return (
    <>
      <div className="bg-secondary-black w-full flex justify-center  h-screen pt-4">
        {/* form */}
        <div className="w-5/12 h-5/6 border bg-primary-black border-white  ">
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
                  // value={textInputs.title}
                  // onChange={onTextChange}
                ></input>
                <textarea
                  className="w-full bg-secondary-black caret-white text-xs text-white border border-white mt-8 resize-none overflow-y-auto"
                  id="post"
                  rows={18}
                  name="textarea"
                  placeholder="Create a post..."
                  // value={textInputs.body}
                  // onChange={onTextChange}
                ></textarea>
                <div className="flex justify-between">
                  <div className="flex">
                    <p className="text-white text-md">Add tags: </p>
                    <input
                      type="text"
                      placeholder="Tag..."
                      name="tag"
                      size={10}
                      onChange={changeHandler}
                    ></input>
                    <button
                      type="button"
                      className="text-white text-sm border border-white w-12 rounded ml-2"
                      onClick={addTags}
                    >
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
                  {addTag.map((item: any, key: number) => {
                    return (
                      <>
                        <div
                          key={key}
                          className="text-white text-sm border border-white w-12 rounded ml-4 text-center"
                        >
                          {item}
                        </div>
                      </>
                    );
                  })}
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* you profile and other users  */}
        <div id="outer" className="  bg-primary-black w-1/6 h-5/6  ">
          <div className="flex  justify-center">
            <div className="border border-white h-1/3 rounded-xl w-3/4 ">
              <div className="flex justify-center h-2/4">
                <div className=" border border-white flex flex-wrap mt-2 w-11/12 h-7/8 rounded-xl">
                  <img
                    className="w-4 h-4 rounded-full border-[1px] cursor-pointer border-white mt-2 ml-2"
                    src="/src/assets/img/testUserPic.jpeg"
                    alt="user"
                  />
                  <p className="text-white text-sm mt-2 ml-2 ">
                    {profile.name}
                  </p>
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
          </div>
          {/* People similar to you */}
          <div className="flex justify-center ">
            <div className="w-8/12">
              {list.map((item, key) => {
                return (
                  <>
                    <div className="border border-white text-white text-xs flex flex-wrap h-1/3 mt-6 rounded-2xl">
                      <img
                        className="w-4 h-4 rounded-full border-[1px] cursor-pointer border-white mt-2 ml-2"
                        src="/src/assets/img/testUserPic.jpeg"
                        alt="user"
                        key={key}
                      />
                      <p className="text-white text-sm mt-2 ml-2">
                        {item.user}
                      </p>
                      <p className="basis-full text-xs text-white text-center mb-px">
                        <p className="basis-full text-xs text-white text-center mb-px">
                          Likes: {item.likes}
                        </p>
                        Subscribers: {item.subscribers}
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
