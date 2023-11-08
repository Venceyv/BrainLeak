import { FC, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { UserSearch } from '../feature/Search';
import { TopUser } from '../feature/TopUser';
import { Trending } from '../feature/trending';

export const Search: FC = (): JSX.Element => {
  return (
    <div className="relative flex justify-center bg-primary-black">
      <div className="flex flex-col w-full max-w-[1024px] h-[calc(100%-56px)] content-start bg-primary-black text-white">
        <div className="flex items-center justify-center gap-3 pt-9 pb-7">
          <img
            src="../assets/img/search.svg"
            alt="search icon"
            className="w-9 h-9"
          />
          <h1 className="text-3xl text-center text-white">
            Search Results
          </h1>
        </div>
        <div className="flex flex-row max-w-[1024px]">
          <UserSearch />
          <TopUser />
        </div>
      </div>
    </div>
  );
};

export default Search;
