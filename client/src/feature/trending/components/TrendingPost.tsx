import { FC } from "react";

export const TrendingPost: FC = (): JSX.Element => {
  return (
    <div className="flex justify-center gap-3 py-4 w-[238px] h-[184px]">

      <div className="flex flex-col bg-secondary-black w-full rounded-2xl p-3 pb-[1px] border-[1px] border-zinc-400 cursor-pointer">
        <h1 className="text-[14px] font-bold w-full">Title this is title blah blah blah bluuuuuuuurrrree</h1>
        <p className="text-[12px] overflow-hidden truncate w-full text-zinc-400">{}</p>
        <span className="flex flex-row gap-2 text-[11px] pt-3">
          <p className="overflow-hidden truncate">fire: </p>
        </span>
      <div className="flex flex-row items-center justify-start">
        <img
          className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer text-zinc-50"
          src="../../assets/img/testUserPic.jpeg"
          alt="user"
        />
        <p className="text-sm cursor-pointer overflow-ellipsis">{}</p>
      </div>
      </div>
    </div>
  );
};
