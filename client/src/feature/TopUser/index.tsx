import { FC } from 'react';
import { TopUserBanner } from './components/TopUserBanner';
import { UserCard } from './components/UserCard';
import { UserCards } from './components/UserCards';

export const TopUser: FC = (): JSX.Element => {
  return (
    <div>
      <TopUserBanner />
      <UserCards />
    </div>
  );
};
