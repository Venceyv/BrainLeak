import { FC, useEffect, useRef, useState } from 'react';
import { useApplyFocus } from './PostFilterBar.hook';

type MenuItem = 'top' | 'new' | 'hot' | null;
type IntervalItem = 'today' | 'week' | 'month' | 'year' | 'allTime' | null;

interface PostFilterBarProp {
  selectedMenuItem: MenuItem;
  setSelectedMenuItem: React.Dispatch<React.SetStateAction<MenuItem>>;
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<IntervalItem>>;
}

export const PostFilterBar: FC<PostFilterBarProp> = ({
  selectedMenuItem,
  setSelectedMenuItem,
  setSelectedTimeInterval,
}): JSX.Element => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { applyFocus } = useApplyFocus(buttonRef);

  useEffect(() => {
    applyFocus(0);
    sessionStorage.setItem('currMenuItemLoc', '0');
  }, []);

  const isShowTimeInterval = selectedMenuItem === 'top' || selectedMenuItem === 'hot';

  const setSelectedTime = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeInterval(ev.target.value as IntervalItem);
  };

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
        <img src="../../../assets/img/fire.svg" className="w-7 h-8 pb-1" alt="hot" />
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
        <img src="../../assets/img/new4.svg" className="w-7 h-7" alt="new" />
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
        <img src="../../../assets/img/Top.svg" className="w-7 h-7" alt="top" />
        <p className="align-middle text-opacity-75 pl-1 group-hover:text-opacity-100 group-focus:text-opacity-100 text-white">
          Top
        </p>
      </button>

      {isShowTimeInterval && (
        <div className="group flex items-center h-fit rounded-md p-[2px] hover:cursor-pointer border-2 border-border-black bg-primary-black">
          <img
            src="../../../assets/img/timer.svg"
            className="w-7 h-7 opacity-[.9] group-hover:opacity-100"
            alt="top"
          />
          <select
            className="rounded-md h-[24px] align-middle hover:cursor-pointer bg-primary-black focus:text-white focus:bg-primary-black focus:outline-none hover:bg-secondary-black text-white"
            defaultValue="allTime"
            onChange={(ev) => setSelectedTime(ev)}
          >
            <option value="today" className="align-middle hover:bg-secondary-black">
              Today
            </option>
            <option value="week" className="align-middle hover:bg-secondary-black">
              This Week
            </option>
            <option value="month" className="align-middle hover:bg-secondary-black">
              This Month
            </option>
            <option value="year" className="align-middle hover:bg-secondary-black">
              This Year
            </option>
            <option value="allTime" className="align-middle hover:bg-secondary-black">
              All Time
            </option>
          </select>
        </div>
      )}
    </div>
  );
};
