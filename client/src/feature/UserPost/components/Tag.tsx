import { FC } from 'react';

export const Tag: FC<{ tag: string }> = ({ tag }): JSX.Element => {
  return (
    <div className="h-[20px] w-fit text-[11px] px-1 pb-[2px] pt-[1px] mr-1 font-[500] text-white bg-border-black border-border-black border-2 rounded-md">
      {tag}
    </div>
  );
};
