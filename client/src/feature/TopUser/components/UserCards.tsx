import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getUserTrending } from '../../../api/userAPI';
import { Loading } from '../../../components/Loading';
import { UserCard } from './UserCard';

export const UserCards: FC = (): JSX.Element => {
  const { data = null, isLoading } = useQuery(['userCards'], () =>
    getUserTrending()
  );

  if (isLoading) {
    return <Loading width={'[270px]'} height={'full'} />;
  }

  return (
    <div className="flex flex-col h-fit w-fit items-end gap-4 bg-primary-black">
      {data &&
        data.map((userCard, index) => {
          return <UserCard key={index} {...userCard} />;
        })}
    </div>
  );
};
