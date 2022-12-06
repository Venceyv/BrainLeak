import { FC } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { useQuery } from '@tanstack/react-query';
import { NewPost } from '../feature/NewPost';
import { getUserId } from '../utils/getLocalStorage';
import { getCheckAuth } from '../api/userAPI';
import { Trending } from '../feature/trending';
import { AuthorCard } from '../feature/AuthorCard';

export const CreatePost: FC = (): JSX.Element => {
  const { data, isSuccess, isError, error } = useQuery(
    ['checkUserAuth'],
    () => getCheckAuth(getUserId())
  );

  if (isError) {
    console.log(error);
  }

  return (
    <div
      id="scroll-target-node"
      className="fixed inset-0 right-0 mt-[56px] flex items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto"
    >
      <div className=" absolute top-0 w-full h-full max-w-[1024px] z-10 bg-post-bg-black">
        <div className="flex flex-row">
          <div className="flex flex-col justify-center max-w-[702] w-full bg-post-bg-black">
            <div className=" flex flex-row w-full max-w-[1024px]">
              <NewPost />
              {/* <Trending /> */}
            </div>
          </div>
          <AuthorCard authorId="635c799ff7a49ef626bb1bb7" />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

// "https://storage.googleapis.com/brainleak/404(ghost).jpg"
// "https://storage.googleapis.com/brainleak/404%EF%BC%88cat).jpg"
// "https://storage.googleapis.com/brainleak/404(astronaut).jpg"
