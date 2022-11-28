import { FC } from 'react';

export const NoMore: FC = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <img
        src="../assets/img/no-more.png"
        className="w-[60px] h-[56px]"
        alt="no more"
      />
      <p className="text-lg">You have seen it all !!!</p>
    </div>
  );
};
