import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { NewComment } from '../UserPost/components/NewComment';
import { Comments } from './components/Comments';
import { IndividualComment } from './components/IndividualComment';

export const Comment: FC = (): JSX.Element => {
  const { postId } = useParams();
  return (
    <div>
      <IndividualComment />
      <Comments postId={postId!} />
    </div>
  );
};
