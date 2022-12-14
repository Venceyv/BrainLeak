import { FC, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User } from '../../../interfaces/user';
import { useApplyFocus } from '../../AbstractPost/components/PostFilterBar.hook';
import { UserFollowingList } from './UserFollowingList';
import { UserFollowList } from './UserFollowList';

type followingMenuCategory = 'followers' | 'following';

interface ProfileFollowingMenuProp {
  user: User;
}

export const UserFollowingMenu: FC<ProfileFollowingMenuProp> = ({
  user,
}): JSX.Element => {
  const [followingCategory, setFollowingCategory] =
    useState<followingMenuCategory>('followers');
  const buttonRef = useRef<HTMLDivElement>(null);
  const { applyFocus } = useApplyFocus(buttonRef, true);
  const navigate = useNavigate();

  useEffect(() => {
    applyFocus(0);
    sessionStorage.setItem('currFollowMenuItemLoc', '0');
  }, []);

  return (
    <div className="w-full">
      <div
        className="flex justify-center items-center gap-2 h-[61px] w-full my-4 p-3 rounded-md shadow bg-gradient-to-r from-post-bg-black to-secondary-black shadow-border-black bg-secondary-black"
        ref={buttonRef}
      >
        <button
          className="group flex items-center h-[36px] rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
          onClick={() => {
            applyFocus(0);
            setFollowingCategory('followers');
          }}
        >
          <p className="align-middle pr-1 text-opacity-75 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
            Followers
          </p>
        </button>
        <button
          className="group flex items-center h-fit px-1 rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
          onClick={() => {
            applyFocus(1);
            setFollowingCategory('following');
          }}
        >
          <p className="align-middle text-opacity-75 pl-1 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
            Following
          </p>
        </button>
      </div>
      {followingCategory === 'following' && (
        <UserFollowingList {...user} />
      )}
      {followingCategory === 'followers' && (
        <UserFollowList {...user} />
      )}
    </div>
  );
};
