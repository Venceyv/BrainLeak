import { FC } from 'react';

export const UserCard: any = ({ user }: any): JSX.Element => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 py-3 overflow-hidden w-[260px] h-[160px] rounded-2xl p-3 pb-[0px] border-2 bg-secondary-black border-border-black cursor-pointer">
      <div className="flex items-center justify-start gap-2 col-span-2">
        <img className="w-[38px] h-[38px] rounded-full border-2 cursor-pointer border-border-black  text-zinc-50" src={user.avatar} alt="profile picture" />
        <p className="text-sm cursor-pointer truncate">{user.name}</p>
        <p className="text-sm cursor-pointer truncate">Subscribers: {user.subscribers}</p>
      </div>
      <div className="flex pb-2 items-end justify-end gap-1">
        <img src="../../../assets/img/hot.svg" alt="trending" className="w-6" />
        <p className="h-fit truncate text-sm">Like count: {user.like}</p>
      </div>
    </div>
  );
};
