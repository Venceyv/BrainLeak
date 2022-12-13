import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC } from 'react';
import { getCheckAuth, putFollowUser } from '../../../api/userAPI';
import { User } from '../../../interfaces/user';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';
import { formatNumber } from '../../../utils/formatNumber';
import { getUserId } from '../../../utils/getLocalStorage';

export const UserCard: FC<User> = (user) => {
  const { data, isSuccess } = useQuery(
    ['checkUserAuth'],
    () => getCheckAuth(getUserId()),
    {
      retry: 0,
    }
  );

  const putFollowUserMutation = useMutation(
    ['putFollowUser'],
    () => putFollowUser(user._id),
    {
      onSuccess: () => {
        successToast('Success!');
        queryClient.invalidateQueries(['userData']);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        } else {
          errorToast('An error has occurred');
        }
      },
    }
  );

  const isAllowFollow =
    !data || (data._id !== user._id && user.following === false);

  return (
    <div className="absolute left-[70px] top-[110px] flex flex-col items-center gap-2 w-[280px] h-fit rounded-md shadow shadow-border-black text-white bg-gradient-to-b from-post-bg-black to-secondary-black">
      <img
        // src={user.avatar}
        src="https://blog.homesalive.ca/hubfs/Blog/2019/Christmas%20Gifts%20for%20Cats%20-%2010%20Fun%20Stocking%20Stuffer%20Ideas/christmas-gifts-for-cats-article-feature.jpg"
        alt="user avatar"
        className="w-full h-[300px] object-cover rounded-tl-md rounded-tr-md"
      />

      {data?._id !== user._id && (
        <div
          className="absolute top-[250px] right-[10px] flex flex-row rounded-3xl py-1 px-4 shadow cursor-pointer shadow-border-black text-white bg-secondary-black"
          onClick={() => putFollowUserMutation.mutate()}
        >
          {isAllowFollow ? (
            <p className="pt-[3px]">Follow</p>
          ) : (
            <p className="pt-[3px]">Unfollow</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6 p-6 w-full">
        {/* about */}
        <div className="flex flex-col justify-start w-full gap-1 text-white">
          <p className="text-sm font-bold">ABOUT</p>
          <div className="mt-1 min-h-[48px]">{user.introduction}</div>
        </div>

        {/* stats */}
        <div className="flex flex-col items-start justify-center gap-1 mt-2 w-full text-sm text-white">
          <div className="flex flex-row w-full gap-1">
            <p>FOLLOWERS </p>
            <p className="font-bold align-middle text-center truncate ml-auto">
              {formatNumber(user.statistics?.follower)}
            </p>
          </div>
          <div className="flex flex-row w-full gap-1">
            <p>FOLLOWING </p>
            <p className="font-bold align-middle text-center truncate ml-auto">
              {formatNumber(user.statistics?.following)}
            </p>
          </div>
          <div className="flex flex-row w-full gap-1 ">
            <p>POSTS </p>
            <p className="align-middle font-bold text-center truncate ml-auto">
              {formatNumber(user.statistics?.posts)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
