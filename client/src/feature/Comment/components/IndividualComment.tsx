import { FC } from 'react';
import TimeAgo from 'react-timeago';

export const IndividualComment: FC = (): JSX.Element => {
  return (
    <div className="pl-4">
      <div className="flex items-center justify-start gap-2 col-span-2">
        <img
          className="w-[32px] h-[32px] rounded-full border-2 cursor-pointer border-border-black text-zinc-50"
          src={'https://picsum.photos/id/237/200/300'}
          alt="profile picture"
        />
        <p className="text-sm cursor-pointer truncate text-white">{'images'}</p>
        <div className="pt-[8px] h-[calc(100%-2px)] text-xs text-white">*</div>
        <TimeAgo className="text-xs pt-[2px] text-white opacity-90" date={`6-10-2022`} />
      </div>

      <div className="border-l-2 pl-6 ml-[14px] mt-2 text-sm border-border-black text-white">
        This is a comment example
      </div>
    </div>
  );
};
