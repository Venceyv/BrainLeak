import { FC, useState } from 'react';
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
import { getCheckAuthAuthor } from '../../../api/userAPI';
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { deletePost } from '../../../api/postAPI';
import { errorToast, successToast } from '../../../utils/errorToast';
import { queryClient } from '../../../main';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { PostMetaData } from './PostMetaData';

export const PostContent: FC<{
  post: Post<StatisticWithMark>;
  postId: string;
}> = ({ post, postId }): JSX.Element => {
  const navigate = useNavigate();
  const {
    data: author,
    isSuccess,
    isError,
  } = useQuery(
    ['checkAuthAuthor'],
    () => getCheckAuthAuthor(post.author._id),
    { retry: false }
  );

  const deletePostMutation = useMutation(
    ['deletePost'],
    () => deletePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        navigate(-1);
        queryClient.invalidateQueries(['posts']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('You are not the author of this post');
        }
      },
    }
  );

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
        <PostMetaData
          author={post?.author}
          publishDate={post.publishDate}
          isAuthor={!author ? true : false}
          deletePostMutation={deletePostMutation}
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
