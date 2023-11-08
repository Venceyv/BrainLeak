import React, { FC, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { errorToast } from '../../../utils/errorToast';

export const SearchItem: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const handleEnterKey = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      if (inputValue === '')
        return errorToast('Input something 〆(´Д｀ )');

      navigate(`search/?q=${encodeURIComponent(inputValue)}`, {
        state: { query: inputValue },
      });
      setInputValue('');
      navigate(0);
    }
  };

  return (
    <div className="relative mx-auto">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <input
        ref={inputRef}
        type="search"
        className="block p-4 pl-10 w-[260px] h-5 text-sm leading-normal bg-primary-black rounded-lg placeholder-zinc-400 text-white"
        placeholder="Search a post..."
        value={inputValue}
        onChange={() => setInputValue(inputRef?.current?.value!)}
        onKeyUp={(ev) => handleEnterKey(ev)}
      />
    </div>
  );
};
