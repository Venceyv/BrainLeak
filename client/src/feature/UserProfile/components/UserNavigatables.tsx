import {
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCheckAuth, putFollowUser } from '../../../api/userAPI';
import { Loading } from '../../../components/Loading';
import { User } from '../../../interfaces/user';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';
import { formatNumber } from '../../../utils/formatNumber';
import { getUserId } from '../../../utils/getLocalStorage';
import { fallback } from '../../../utils/imgFallback';

export const UserNavigatables: FC<User> = (user) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-row items-center justify-center gap-2 mb-4 px-1 w-full rounded-md hover:bg-gradient-to-r cursor-pointer from-post-bg-black to-border-black text-white"
      onClick={() => {
        navigate(`/user/profile/${user._id}`);
        navigate(0);
      }}
    >
      <img
        className="h-[50px] w-[50px] rounded-full border-2 cursor-pointer border-border-black"
        src={user?.avatar}
        onError={fallback}
        alt="user"
      />
      <p className="text-sm grow cursor-pointer w-[140px] text-left truncate">
        {user?.username}
      </p>
    </div>
  );
};
