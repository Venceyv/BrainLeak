import { FC, useState } from 'react';
import { PostForm } from './components/PostForm';

export const NewPost: FC = () => {
  const [titleLength, setTitleLength] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);

  const [textInputs, setTextInputs] = useState<{
    title: string;
    body: string;
  }>({
    title: '',
    body: '',
  });

  const handleCreatePost = async () => {
    const newPost = {
      title: textInputs.title,
      body: textInputs.body,
    };
    try {
      //store the post in database
    } catch (error: any) {
      console.log('handleCreatePost error', error.message);
    }
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({ ...prev, [name]: value }));
  };

  // let changeHandler = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ): void => {
  //   e.preventDefault();
  //   setTag(e.target.value);
  // };
  // let addTags = () => {
  //   const newTag = tag;
  //   if (addTag.length < 3) {
  //     setaddTag([...addTag, newTag]);
  //   }
  // };
  //270   704
  return (
    <div className="flex justify-center w-full h-full bg-primary-black">
      {/* <h2 className="text-center text-2xl text-white">
        Create a Post
      </h2> */}
      <div className="flex flex-col w-full max-w-[1024px] h-full border-2 rounded-md mt-[76px] bg-post-bg-black border-border-black  ">
        <PostForm />
      </div>
    </div>
  );
};
export default NewPost;
