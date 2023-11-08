import { FC } from 'react';

export const TopUserBanner: FC = () => {
  return (
    <div className="relative flex items-center gap-2 h-[200px] min-w-[270px] w-full max-w-[670px] my-4 p-3 rounded-lg bg-secondary-black">
      <div className="flex flex-col items-center gap-2 ml-auto p-3 border-border-black">
        <img
          src="../../../assets/img/trophy.svg"
          className="w-7 h-7"
          alt="top user trophy"
        />
        <p className="text-lg">Top</p>
        <p className="text-lg">Leakers</p>
      </div>
      {/* <img src="../../../assets/img/banner.svg" className="absolute left-[120px]" alt="banner" /> */}
      <img
        src="../../../assets/img/top-user.png"
        className="absolute top-[-50px] right-[50px]"
        alt="top user person"
      />
    </div>
  );
};
