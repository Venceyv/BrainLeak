import { FC } from 'react';
import { formatNumber } from '../../../utils/formatNumber';

export const TopBar: FC<{ likes: number; dislikes: number }> = ({ likes, dislikes }): JSX.Element => {
  return (
    <div className="absolute flex gap-3 mb-2 p-[2px] w-[calc(100%-32px)] border-2 rounded-md bg-secondary-black border-border-black">
      <div className="flex gap-3 pl-1">
        <div className="flex items-center">
          <img src="../../../assets/img/like.svg" className="w-5 h-5 cursor-pointer" alt="like" />
          <p className="truncate pl-[2px] pt-[1px] text-sm text-white">{formatNumber(likes)}</p>
        </div>
        <div className="flex items-center">
          <img src="../../../assets/img/dislike.svg" className="w-5 h-5 cursor-pointer" alt="dislike" />
          <p className="truncate pl-[2px] pt-[1px] text-sm text-white">{formatNumber(dislikes)}</p>
        </div>
      </div>

      <img src="../../../assets/img/close-hanger.svg" className="w-8 h-8 cursor-pointer ml-auto mr-5" alt="close" />
      {/* <img src="../../../assets/img/close.svg" className="w-6 h-6 cursor-pointer" alt="like" /> */}
    </div>
  );
};
