import { FC, useEffect, useRef, useState } from 'react';
import { SortByType } from './Comments';

interface PostFilterBarProp {
  sortBy: SortByType;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
}

export const CommentSortBar: FC<PostFilterBarProp> = ({
  sortBy,
  setSortBy,
}): JSX.Element => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const setCommentSortBy = (
    ev: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortBy(ev.target.value as SortByType);
  };

  return (
    <div className="flex flex-row gap-2 pl-4">
      <img
        src="../../../assets/img/timer.svg"
        className="w-7 h-7 opacity-[.9] group-hover:opacity-100"
        alt="top"
        title="Sort by"
      />
      <p className="pt-[2px] text-white">Sort by: </p>
      <div className="group gap-1 flex items-center w-fit h-fit rounded-md p-[2px] hover:cursor-pointer border-2 border-border-black bg-primary-black">
        <select
          className="rounded-md h-[24px] align-middle hover:cursor-pointer bg-post-bg-black focus:text-white focus:bg-primary-black focus:outline-none hover:bg-secondary-black text-white"
          defaultValue={`${sortBy}`}
          onChange={(ev) => setCommentSortBy(ev)}
        >
          <option
            value="new"
            className="align-middle hover:bg-secondary-black"
          >
            New
          </option>
          <option
            value="hot"
            className="align-middle hover:bg-secondary-black"
          >
            Hot
          </option>
          <option
            value="top"
            className="align-middle hover:bg-secondary-black"
          >
            Top
          </option>
        </select>
      </div>
    </div>
  );
};
