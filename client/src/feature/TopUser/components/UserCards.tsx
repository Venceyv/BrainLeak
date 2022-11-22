import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getUserTrending } from '../../../api/userAPI';

export const UserCards: FC = ({ user }: any): JSX.Element => {
  const { data } = useQuery(['userCards'], () => getUserTrending());
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 py-3 overflow-hidden w-[260px] h-[160px] rounded-2xl p-3 pb-[0px] border-2 bg-secondary-black"></div>
  );
};
