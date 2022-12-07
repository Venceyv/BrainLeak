import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../../api/userAPI';

export const UserProfile: FC = () => {
  const { userId } = useParams();

  const { data, isSuccess, isError } = useQuery(
    ['userData'],
    () => getUser(userId!),
    { refetchOnWindowFocus: false }
  );

  if (isSuccess) {
    console.log(data);
  }
  return <div></div>;
};
