import { FC } from 'react';
import { TopUserBanner } from './components/TopUserBanner';
import { UserCard } from './components/UserCard';

const users: any[] = [
  {
    id: 1,
    name: 'Corinna',
    subscribers: 29994,
    like: 8036,
    avatar: 'https://img0.baidu.com/it/u=1301635771,2717612800&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
  },
  {
    id: 2,
    name: 'Selig',
    subscribers: 13413,
    like: 3501,
    avatar: 'https://img0.baidu.com/it/u=3029884816,7140680&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500',
  },
  {
    id: 3,
    name: 'Merralee',
    subscribers: 24693,
    like: 3678,
    avatar: 'https://img0.baidu.com/it/u=2847193715,3280621768&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  },
  {
    id: 4,
    name: 'Mareah',
    subscribers: 4245,
    like: 9074,
    avatar: 'https://img0.baidu.com/it/u=1215328029,2575861253&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  },
  {
    id: 5,
    name: 'Jaclin',
    subscribers: 19175,
    like: 6721,
    avatar: 'https://img1.baidu.com/it/u=1386733571,1401918422&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  },
  {
    id: 6,
    name: 'Lilah',
    subscribers: 9831,
    like: 7766,
    avatar: 'https://img0.baidu.com/it/u=1348475057,396079538&fm=253&fmt=auto&app=138&f=JPEG?w=503&h=500',
  },
];

export const TopUser: FC = (): JSX.Element => {
  return (
    <div>
      <TopUserBanner />
      <div className="flex flex-col h-fit w-fit items-end bg-primary-black">
        {users.map((user, index) => {
          return <UserCard key={index} user={user} />;
        })}
      </div>
    </div>
  );
};
