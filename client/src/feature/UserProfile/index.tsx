import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../../api/userAPI';
import { UserInfo } from './components/UserInfo';

export const UserProfile: FC = () => {
  const { userId } = useParams();

  const { data, isSuccess, isError } = useQuery(
    ['userData'],
    () => getUser(userId!),
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );

  if (isSuccess) {
    console.log(data);
  }
  return <div>{data && <UserInfo {...data} />}</div>;
};
