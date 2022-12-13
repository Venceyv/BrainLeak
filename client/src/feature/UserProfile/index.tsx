import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../../api/userAPI';
import { BackgroundCard } from './components/BackgroundCard';
import { UserCard } from './components/UserCard';
import { UserInfo } from './components/UserInfo';

export const UserProfile: FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isSuccess, isError } = useQuery(
    ['userData'],
    () => getUser(userId!),
    { refetchOnWindowFocus: false, cacheTime: 0, retry: 1 }
  );

  if (isSuccess) {
    console.log(data);
  }

  if (isError) {
    navigate(-1);
  }

  return (
    <div className="relative h-fit max-w-[1024px] col-span-3 bg-post-bg-black">
      {data && <BackgroundCard {...data} />}
      {/* {data && <UserInfo {...data} />}  */}
      {data && <UserCard {...data} />}
    </div>
  );
};
