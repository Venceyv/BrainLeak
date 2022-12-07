import { FC, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postCreatePost } from '../../api/postAPI';
import { errorToast, successToast } from '../../utils/errorToast';
import { TagItem } from './components/Tag';
import './index.css';
import 'react-quill/dist/quill.snow.css';

export const NewPost: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [notify, setNotify] = useState<boolean>(false);

  const createPostMutation = useMutation(
    ['postCreatePost'],
    () => postCreatePost(title, body, tags, notify),
    {
      onSuccess: () => {
        successToast('Post created successfully!');
        resetPost();
      },
      onError: (err: AxiosError) => {
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        } else {
          errorToast('An error has occurred');
        }
      },
    }
  );

  const onCreatePost = () => {
    if (title.length > 300) {
      return errorToast('Title cannot be more than 300 letter!');
    }
    createPostMutation.mutate();
  };

  const handleEnterKey = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      if (tag === '') return errorToast('Input something 〆(´Д｀ )');

      setTags((prev) => [...prev, tag]);
      setTag('');
    }
  };

  const onTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event;

    if (title.length >= 300) {
      return;
    }
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

    if (tags.includes(tag)) {
      return errorToast('No duplicate tags please!');
    }

    setTags((prev) => [...prev, tag]);
    setTag('');
  };

  const resetPost = () => {
    setTitle('');
    setTag('');
    setTags([]);
    setBody('');
    setNotify(false);
  };

  return (
    <form className="grow w-full min-w-[510px] max-w-[704px]">
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
            onKeyUp={handleEnterKey}
            className="px-2 rounded-md border-2 text-sm pt-[2px] text-white bg-secondary-black border-border-black"
          />
          <button
            type="button"
            className="pt-[2px] px-1 w-14 rounded-md text-sm border-2 hover:border-white hover:bg-white hover: hover:text-border-black border-border-black text-white"
            onClick={onSetTag}
          >
            Add +
          </button>

          <div className="flex items-center gap-2 ml-auto ">
            <input
              id="default-checkbox"
              type="checkbox"
              className="w-4 h-4 border-2 accent-border-black rounded bg-border-black border-border-black   active:border-black"
              checked={notify}
              onChange={() => setNotify((prev) => !prev)}
            />
            <label
              htmlFor="default-checkbox"
              className="pt-[2px] text-white"
            >
              Notify me on post activities!!
            </label>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-2">
          {tags.map((tag, index) => (
            <TagItem key={index} tagName={tag} setTags={setTags} />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="w-fit pt-[2px] px-3 border-2 border-border-black rounded-lg hover:bg-white hover:text-secondary-black hover:border-secondary-black"
            onClick={resetPost}
          >
            Reset
          </button>
          <button
            type="button"
            className="w-fit pt-[2px] px-3 border-2 border-border-black rounded-lg hover:bg-white hover:text-secondary-black hover:border-secondary-black"
            onClick={() => createPostMutation.mutate()}
          >
            Post!!
          </button>
        </div>
      </div>
    </form>
  );
};
