import { FC } from 'react';
import {
  Post,
  Statistic,
  StatisticWithMark,
} from '../../../interfaces/post';
import { Statistics } from './Statistics';
import { Tag } from './Tag';
import { TopBar } from './TopBar';
import TimeAgo from 'react-timeago';
import { NewComment } from './NewComment';
import { Author } from '../../../interfaces/user';
import { fallback } from '../../../utils/imgFallback';

const PostBy: FC<{ author: Author; publishDate: string }> = ({
  author,
  publishDate,
}): JSX.Element => {
  return (
    <div className="flex gap-1">
      <img
        src={author?.avatar}
        onError={fallback}
        className="w-5 h-5 rounded-full border-2 border-border-black cursor-pointer"
        alt="user image"
      />
      <p className="truncate pl-[2px] pt-[3px] text-xs text-white">
        {author?.username}
      </p>
      <div className="ml-2 pt-[3px] h-[calc(100%-2px)] text-white">
        *
      </div>
      <TimeAgo
        className="text-xs pt-[2px] opacity-90 text-white"
        date={`${publishDate}`}
      />
    </div>
  );
};

export const PostContent: FC<{
  post: Post<StatisticWithMark>;
  postId: string;
}> = ({ post, postId }): JSX.Element => {
  return (
    <div className="flex gap-5 shrink grow flex-col w-[720px] h-full p-4 pr-0">
      <TopBar
        likes={post.statistics.likes}
        dislikes={post.statistics.dislikes}
        isLike={post?.like ? true : false}
        isDislike={post?.dislike ? true : false}
        isSave={post?.save ? true : false}
        postId={postId}
      />
      <div className="flex flex-col gap-1 mt-[60px] p-2 border-2 rounded-md bg-secondary-black border-border-black">
        <PostBy
          author={post?.author}
          publishDate={post.publishDate}
        />
        <div className="w-full text-[20px] font-bold text-white">
          {post.title}
        </div>
        <div className="flex my-2 flex-wrap w-full">
          {post.tags.map((tag, index) => {
            return <Tag key={index} tag={tag} />;
          })}
        </div>
        <div className="text-sm mt-3 w-full text-white">
          {post.description}
        </div>
        <Statistics
          view={post?.statistics?.views}
          comment={post?.statistics?.comments}
          marks={post?.statistics?.marks}
        />
      </div>
      <NewComment postId={postId} isReply={false} />
    </div>
  );
};
