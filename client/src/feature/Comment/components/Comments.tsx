import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getComments } from '../../../api/commentAPI';
import { IndividualComment } from './IndividualComment';
import TimeAgo from 'react-timeago';

interface CommentsProp {
  postId: string;
}

export const Comments: FC<CommentsProp> = ({ postId }): JSX.Element => {
  const { data, isError } = useQuery(['postComment'], () => getComments(postId));
  return (
    <>
      <div>
        {data &&
          data.map((comment, index) => {
            return <IndividualComment key={index} {...comment} />;
          })}
      </div>
    </>
  );
};
