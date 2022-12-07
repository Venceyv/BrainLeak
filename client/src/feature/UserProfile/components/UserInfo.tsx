import { FC } from 'react';
import { User } from '../../../interfaces/user';

export const UserInfo: FC<User> = (user) => {
  return (
    <div className="relative flex flex-col items-center h-full w-[1024px] shadow-md shadow-border-black bg-post-bg-black">
      <img
        src={user.backgroundCover}
        alt="background"
        className="object-cover h-[250px] w-full shadow-md shadow-border-black "
      />
      <div className="h-[100px] bg-gradient-to-r from-transparent to-transparent">
        <img
          src={`https://cdn.discordapp.com/attachments/886006808731328532/1049999964186624010/13C5FC46-8D93-4369-8E7C-E789AB5F13F7.jpg`}
          alt="user avatar"
          className="absolute top-[100px] left-[60px] h-[350px] w-[240px] object-cover shadow-md shadow-border-black"
        />
        <div>
          <div className="text-3xl">{user.username}</div>
          <div>{user.introduction}</div>
        </div>
        <div>{user.statistics.follower}</div>
        <div>{user.statistics.following}</div>
        <div>{user.statistics.posts}</div>
        <div>{user.statistics.comments}</div>
        <div>{user.statistics.upvotes}</div>
      </div>
    </div>
  );
};
