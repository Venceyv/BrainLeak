import React, { FC, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import './PostForm.css';
import 'react-quill/dist/quill.snow.css';
import { errorToast } from '../../../utils/errorToast';

export const PostForm: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');

  // const handleCreatePost = async () => {
  //   const newPost = {
  //     title: formInput.title,
  //     body: formInput.body,
  //   };
  //   try {
  //   } catch (error: any) {
  //     console.log('handleCreatePost error', error.message);
  //   }
  // };

  const onTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event;

    setTitle(value);
  };

  const onTagInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    setTag(value);
  };

  const onSetTag = () => {
    if (!tag) {
      return errorToast('Tags cannot be empty!');
    }

    setTags((prev) => [...prev, tag]);
    setTag('');
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
    <form className="grow w-full max-w-[704px] p-2">
      <div className="relative">
        <input
          className="h-[39px] mt-4 border-2 rounded-md p-2 pl-4 pr-16 w-full bg-secondary-black text-white  border-border-black"
          type="text"
          placeholder="Title..."
          name="title"
          value={title}
          onChange={onTitleChange}
        />
        <div className="absolute right-4 top-[29px] text-[10px] text-white">
          {title.length}/300
        </div>
      </div>

      {/* <textarea
        className="w-full border-2 mt-5 rounded-md border-border-black bg-secondary-black resize-horizontal overflow-y-auto"
        id="post"
        rows={18}
        name="textarea"
        placeholder="Create a post..."
        // value={textInputs.body}
        // onChange={onTextChange}
      ></textarea> */}
      <div className="flex flex-col gap-2 p-2 border-2 mt-[20px] text-white bg-secondary-black border-border-black rounded-md">
        <div>
          <ReactQuill
            placeholder={`Fyi, internet is not a lawless place ... \n不要手嗨了`}
            theme="snow"
            value={body}
            onChange={setBody}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex">
            <img
              className="w-6 h-6"
              src="../../../assets/img/tag.svg"
              alt="tag"
            />
            <p className="text-white text-md">Tags: </p>
          </div>

          <input
            type="text"
            placeholder="Tag..."
            name="tag"
            size={10}
            value={tag}
            onChange={onTagInput}
            className="px-2 rounded-md border-2 text-sm pt-[2px] text-white bg-secondary-black border-border-black"
          />
          <button
            type="button"
            className="pt-[2px] px-1 w-14 rounded-md text-sm border-2 hover:border-white hover:bg-white hover: hover:text-border-black border-border-black text-white"
            onClick={onSetTag}
          >
            Add +
          </button>

          {tags}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="w-fit pt-[2px] px-3 border-2 border-border-black rounded-lg hover:bg-white hover:text-secondary-black hover:border-secondary-black"
            // onClick={onComment}
          >
            Reset
          </button>
          <button
            type="button"
            className="w-fit pt-[2px] px-3 border-2 border-border-black rounded-lg hover:bg-white hover:text-secondary-black hover:border-secondary-black"
            // onClick={onComment}
          >
            Post!!
          </button>
        </div>
      </div>

      <div className="flex justify-between">
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
        {/* {addTag.map((item: any, key: number) => {
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
                  })} */}
      </div>
    </form>
  );
};
