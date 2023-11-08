import { FC } from 'react';

export const NoResult: FC = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-3 mt-10 text-white">
      <div className="flex relative">
        <img
          src="../assets/img/noResult.png"
          className="w-[150px]"
          alt="no more"
        />
        <p className="absolute w-fit text-sm left-[110px] rotate-[30deg] ">
          Sorry
        </p>
      </div>

      <p className="text-lg ">{`I can't find any results`}</p>
    </div>
  );
};
