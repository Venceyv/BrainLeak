import { FC } from 'react';
import { User } from '../../../interfaces/user';

export const UserInfo: FC<User> = (user) => {
  return (
    <div className="w-full">
      <img src={user.backgroundCover} alt="background" />
    </div>
  );
};
