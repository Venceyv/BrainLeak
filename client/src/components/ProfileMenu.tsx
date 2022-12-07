import { FC, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApplyFocus } from '../feature/AbstractPost/components/PostFilterBar.hook';

type menuCategory =
  | 'my-posts'
  | 'bookmarked'
  | 'liked-posts'
  | 'comment-history';

interface ProfileMenu {
  setMenuCategory: React.Dispatch<React.SetStateAction<menuCategory>>;
}

export const ProfileMenu: FC<ProfileMenu> = ({
  setMenuCategory,
}): JSX.Element => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { applyFocus } = useApplyFocus(buttonRef);
  const navigate = useNavigate();

  useEffect(() => {
    applyFocus(0);
    sessionStorage.setItem('currMenuItemLoc', '0');
  }, []);

  return (
    <div
      className="flex items-center gap-2 h-[61px] mr-9 w-fit max-w-[700px] my-4 p-3 border-2 rounded-md shadow-md bg-gradient-to-r from-secondary-black shadow-border-black bg-secondary-black border-border-black"
      ref={buttonRef}
    >
      <button
        className="group flex items-center h-[36px] rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          applyFocus(0);
          navigate('my-posts');
        }}
      >
        <img
          src="../../../assets/img/pencil.svg"
          className="w-7 h-7"
          alt="pencil"
        />
        <p className="align-middle pr-1 text-opacity-75 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          My Posts
        </p>
      </button>
      <button
        className="group flex items-center h-fit px-1 rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          applyFocus(1);
          navigate('bookmarked-posts');
        }}
      >
        <img
          src="../../assets/img/bookmark.svg"
          className="w-7 h-7"
          alt="new"
        />
        <p className="align-middle text-opacity-75 pl-[3px] group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          Bookmarked
        </p>
      </button>
      <button
        className="group flex items-center h-fit px-1 rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          applyFocus(2);
          navigate('liked-posts');
        }}
      >
        <img
          src="../../../assets/img/Heart.svg"
          className="w-7 h-7"
          alt="liked"
        />
        <p className="align-middle text-opacity-75 pl-1 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          Liked Posts
        </p>
      </button>
      <button
        className="group flex items-center h-fit px-1 rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          applyFocus(3);
          navigate('comment-history');
        }}
      >
        <img
          src="../../../assets/img/comment.svg"
          className="w-7 h-7"
          alt="comment"
        />
        <p className="align-middle text-opacity-75 pl-1 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          Comment History
        </p>
      </button>
    </div>
  );
};
