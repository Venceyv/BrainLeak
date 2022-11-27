import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getComments } from '../../../api/postAPI';

interface CommentsProp {
  postId: string;
}

export const Comments: FC<CommentsProp> = ({ postId }): JSX.Element => {
  const { data, isError } = useQuery(['postComment'], () => getComments(postId));
  return <div></div>;
};
