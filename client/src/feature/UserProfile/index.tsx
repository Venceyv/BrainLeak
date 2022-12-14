import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../../api/userAPI';
import { BackgroundCard } from './components/BackgroundCard';
import { UserCard } from './components/UserCard';
import { UserFollowingMenu } from './components/UserFollowingMenu';
import { UserFollowList } from './components/UserFollowList';
import { UserInfo } from './components/UserInfo';

export const UserProfile: FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isSuccess, isError } = useQuery(
    ['userData'],
    () => getUser(userId!),
    { refetchOnWindowFocus: false, cacheTime: 0, retry: 1 }
  );

  if (isError) {
    navigate('/');
  }

  return (
    <div className="relative h-fit max-w-[1024px] col-span-3 ">
      {data && <BackgroundCard {...data} />}
      {/* {data && <UserInfo {...data} />}  */}
      <div className="absolute left-[70px] top-[110px] flex flex-col items-center gap-2 w-[280px] h-fit rounded-md">
        {data && <UserCard {...data} />}
        {data && <UserFollowingMenu user={data} />}
      </div>
    </div>
  );
};
