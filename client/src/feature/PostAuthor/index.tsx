import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/postAPI';
import { AuthorCard } from './components/AuthorCard';

export const PostAuthor: FC = (): JSX.Element => {
  const { postId } = useParams();
  const { data, isLoading, isError } = useQuery(
    ['postData'],
    () => getPost(postId),
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="flex items-start justify-end h-full pt-[76px] pr-4">
      {!!data && <AuthorCard authorId={data?.author?._id} />}
    </div>
  );
};
