import { FC } from 'react';
import { UserStatistics } from '../../../interfaces/user';
import { formatNumber } from '../../../utils/formatNumber';

export const AuthorStats: FC<UserStatistics> = (statistics): JSX.Element => {
  return (
    <div className="flex items-start flex-wrap gap-1 pb-1 justify-start col-span-2 row-span-3">
      <div className="flex w-[130px] gap-1">
        <img src="../../../assets/img/followers.svg" className="w-6 h-6" alt="followers" />
        <p className="text-sm ml-1 align-middle text-center truncate pt-1 text-white">
          Followers: {formatNumber(statistics?.follower)}
        </p>
      </div>
      <div className="flex w-[130px] gap-1">
        <img src="../../../assets/img/follower.svg" className="w-6 h-6" alt="following" />
        <p className="text-sm ml-1 align-middle text-center truncate pt-1 text-white">
          Following: {formatNumber(statistics?.following)}
        </p>
      </div>
      <div className="flex w-[110px] gap-1">
        <img src="../../../assets/img/Postit.svg" className="w-6 h-6" alt="posts" />
        <p className="text-sm ml-1 align-middle text-center truncate pt-1 text-white">
          Posts: {formatNumber(statistics?.posts)}
        </p>
      </div>
      <div className="flex w-[130px] gap-1">
        <img src="../../../assets/img/comment.svg" className="w-6 h-6 text-white" alt="comments" />
        <p className="text-sm ml-1 align-middle text-center truncate pt-1 text-white">
          Comments: {formatNumber(statistics?.comments)}
        </p>
      </div>
      <div className="flex w-[130px] gap-1">
        <img src="../../../assets/img/arrow.svg" className="w-6 h-6" alt="upvotes" />
        <p className="text-sm ml-1 align-middle text-center truncate pt-1 text-white">
          Upvotes: {formatNumber(statistics?.upvotes)}
        </p>
      </div>
    </div>
  );
};
