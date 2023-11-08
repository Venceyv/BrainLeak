import { FC, useEffect, useRef, useState } from 'react';
import { useApplyFocus } from './ResultPostFilterBar.hook';

type MenuItem = 'top' | 'new' | 'hot' | null;

interface PostFilterBarProp {
  selectedMenuItem: MenuItem;
  setSelectedMenuItem: React.Dispatch<React.SetStateAction<MenuItem>>;
}

export const ResultPostFilterBar: FC<PostFilterBarProp> = ({
  selectedMenuItem,
  setSelectedMenuItem,
}): JSX.Element => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { applyFocus } = useApplyFocus(buttonRef);

  useEffect(() => {
    applyFocus(0);
    sessionStorage.setItem('currMenuItemLoc', '0');
  }, []);

  return (
    <div
      className="flex items-center gap-2 h-[61px] w-full max-w-[700px] my-4 p-3 border-2 rounded-md bg-secondary-black border-border-black"
      ref={buttonRef}
    >
      <button
        className="group flex items-center h-[36px] rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          setSelectedMenuItem('hot');
          applyFocus(0);
        }}
      >
        <img
          src="../../../assets/img/fire.svg"
          className="w-7 h-8 pb-1"
          alt="hot"
        />
        <p className="align-middle pr-1 text-opacity-75 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          Hot
        </p>
      </button>
      <button
        className="group flex items-center h-fit px-1 rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          setSelectedMenuItem('new');
          applyFocus(1);
        }}
      >
        <img
          src="../../assets/img/new4.svg"
          className="w-7 h-7"
          alt="new"
        />
        <p className="align-middle text-opacity-75 pl-[3px] group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          New
        </p>
      </button>
      <button
        className="group flex items-center h-fit px-1 rounded-md p-[2px] hover:cursor-pointer border-2 border-secondary-black hover:border-border-black hover:bg-primary-black active:outline-none"
        onClick={() => {
          setSelectedMenuItem('top');
          applyFocus(2);
        }}
      >
        <img
          src="../../../assets/img/Top.svg"
          className="w-7 h-7"
          alt="top"
        />
        <p className="align-middle text-opacity-75 pl-1 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          Top
        </p>
      </button>
    </div>
  );
};
