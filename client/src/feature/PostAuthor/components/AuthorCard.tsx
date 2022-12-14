import { useQuery } from '@tanstack/react-query';
import { FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../api/userAPI';
import { fallback } from '../../../utils/imgFallback';
import { AuthorStats } from './AuthorStats';

export const AuthorCard: FC<{ authorId: string }> = ({
  authorId,
}): JSX.Element => {
  const statRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data, isLoading, isSuccess, isError } = useQuery(
    ['postData', authorId],
    () => getUser(authorId),
    {
      refetchOnWindowFocus: false,
    }
  );

  const toggleStatText = () => {
    let ref = statRef?.current;
    if (!ref?.classList.contains('hidden')) {
      return;
    }

    ref?.classList?.remove('hidden');
    setTimeout(() => {
      ref?.classList?.add('hidden');
    }, 2000);
  };

  return (
    <div className="relative grid grid-cols-3 grid-rows-7 gap-1 py-3 overflow-hidden w-[270px] h-[330px] rounded-md p-3 pb-[0px] border-2 bg-secondary-black border-border-black">
      <img
        src={data?.backgroundCover}
        className="absolute w-full h-16 z-[1] object-cover"
        alt="background cover"
      />

      <div className="absolute flex text-sm w-[calc(100%-80px)] truncate top-[72px] left-[80px]">
        <p className="w-[120px] truncate text-white">
          {data?.username}
        </p>
      </div>

      <div className="flex items-center justify-start gap-2 mt-5 col-span-2 row-span-2">
        <img
          className="w-[60px] h-[60px] mr-auto rounded-full border-2 z-[2] border-border-black  text-zinc-50"
          src={data?.avatar}
          onError={fallback}
          alt="profile picture"
        />
      </div>

      <p className="text-xs col-span-3 row-span-1 text-center text-opacity-75 h-8 w-full line-clamp-2 text-white">
        {data?.introduction}
      </p>

      {!!data && <AuthorStats {...data?.statistics} />}

      <img
        src="../../../assets/img/bunny.png"
        className="col-start-3 row-start-5 translate-x-[-10px] translate-y-2"
        alt="bunny figure"
      />
      <div
        ref={statRef}
        className="hidden absolute top-[152px] left-[140px] rotate-[-10deg] transition-all ease-in-out text-sm text-white"
      >
        {`<- Author's Stats`}{' '}
      </div>
      <div className="relative flex w-full h-full items-end row-start-6 col-start-3 pb-[1px]">
        <img
          src="../../../assets/img/sign.svg"
          className="w-20 origin-top-left rotate-12 translate-x-[-2px]"
          alt="sign figure"
        />
        <div
          className="absolute h-4 w-14 top-[22px] left-[7px] bg-secondary-black rotate-[13deg] rounded-tr-[30px] rounded-br-[30px] cursor-pointer"
          onClick={() => navigate(`/user/profile/${data?._id}`)}
        >
          <p className="absolute top-0 left-[7px] text-sm text-white">
            Profile
          </p>
        </div>
        <div
          className="absolute h-4 w-14 top-[46px] left-[0px] bg-secondary-black rotate-[12deg] rounded-tl-[30px] rounded-bl-[30px] cursor-pointer"
          onClick={toggleStatText}
        >
          <p className="absolute text-sm top-0 left-[10px] text-white">
            Stats
          </p>
        </div>
      </div>
    </div>
  );
};
