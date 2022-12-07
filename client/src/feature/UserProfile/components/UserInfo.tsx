import { FC } from 'react';
import { User } from '../../../interfaces/user';
import { formatNumber } from '../../../utils/formatNumber';

export const UserInfo: FC<User> = (user) => {
  return (
    <div className="relative flex flex-col items-center h-full w-[1024px] bg-post-bg-black">
      <img
        src={user.backgroundCover}
        alt="background"
        className="object-cover h-[240px] w-full shadow-md shadow-border-black"
      />

      <div className="absolute left-[50px] top-[120px] flex flex-col items-center pt-6 gap-2 w-[260px] h-[400px] rounded-md border-2 border-border-black shadow-md shadow-border-black text-white bg-gradient-to-b from-primary-black ">
        <img
          src={user.avatar}
          alt="user avatar"
          className="w-30 h-30 rounded-full object-cover border-2 border-border-black"
        />
        <div className="text-2xl w-full truncate text-center ">
          {user.username}
        </div>
        <div className="mt-1 h-[48px] line-clamp-2">
          {user.introduction}
        </div>
        <div className="flex flex-col items-start justify-center pl-[52px] gap-1 mt-2 w-full text-white">
          {/* <div className="flex items-start flex-wrap gap-1 pb-1 justify-start col-span-2 row-span-3"> */}
          <div className="flex w-[130px] gap-1">
            <img
              src="../../../assets/img/followers.svg"
              className="w-6 h-6"
              alt="followers"
            />
            <p className="text-sm ml-2 align-middle text-center truncate pt-1 text-white">
              Followers: {formatNumber(user.statistics?.follower)}
            </p>
          </div>
          <div className="flex w-[130px] gap-1">
            <img
              src="../../../assets/img/follower.svg"
              className="w-6 h-6"
              alt="following"
            />
            <p className="text-sm ml-2 align-middle text-center truncate pt-1 text-white">
              Following: {formatNumber(user.statistics?.following)}
            </p>
          </div>
          <div className="flex w-[110px] gap-1">
            <img
              src="../../../assets/img/Postit.svg"
              className="w-6 h-6"
              alt="posts"
            />
            <p className="text-sm ml-2 align-middle text-center truncate pt-1 text-white">
              Posts: {formatNumber(user.statistics?.posts)}
            </p>
          </div>
          <div className="flex w-[130px] gap-1">
            <img
              src="../../../assets/img/comment.svg"
              className="w-6 h-6 text-white"
              alt="comments"
            />
            <p className="text-sm ml-2 align-middle text-center truncate pt-1 text-white">
              Comments: {formatNumber(user.statistics?.comments)}
            </p>
          </div>
          <div className="flex w-[130px] gap-1">
            <img
              src="../../../assets/img/arrow.svg"
              className="w-6 h-6"
              alt="upvotes"
            />
            <p className="text-sm ml-2 align-middle text-center truncate pt-1 text-white">
              Upvotes: {formatNumber(user.statistics?.upvotes)}
            </p>
          </div>
          {/* </div> */}
        </div>
      </div>

      <div></div>
    </div>
  );
};
