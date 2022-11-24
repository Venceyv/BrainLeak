import { FC } from 'react';
import { Post } from '../../../interfaces/post';
import { Tag } from './Tag';

export const PostContent: FC<Post> = (post): JSX.Element => {
  return (
    <div className="flex flex-col w-[700px] pt-5 pl-5 bg-black">
      <div className="text-white font-bold">{post.title}</div>
      <div className="flex ">
        {post.tags.map((tag) => {
          return <Tag tag={tag} />;
        })}
      </div>
      <div className="text-white">{post.description}</div>
    </div>
  );
};
