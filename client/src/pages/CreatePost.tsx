import { FC, useEffect } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { useQuery } from '@tanstack/react-query';
import { NewPost } from '../feature/NewPost';
import { getUserId } from '../utils/getLocalStorage';
import { getCheckAuth } from '../api/userAPI';
import { Trending } from '../feature/trending';
import { AuthorCard } from '../feature/AuthorCard';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { PostCloseSVG } from '../components/PostCloseSVG';

export const CreatePost: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { data, isSuccess, isError, error } = useQuery(
    ['checkUserAuth'],
    () => getCheckAuth(getUserId()),
    {
      retry: 0,
    }
  );

  useEffect(() => {
    if (getUserId() === '') {
      navigate('/unauthorized');
    }
  }, []);

  if (isError) {
    if (error === '401') {
      navigate('/unauthorized');
    }
  }

  return (
    <div
      id="scroll-target-node"
      className="fixed inset-0 right-0 mt-[56px] flex items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto"
    >
      <div className=" absolute top-0 w-full h-full max-w-[1024px] z-10 bg-post-bg-black">
        <div className="flex flex-row items-start max-w-[1024px] bg-post-bg-black">
          <div className="p-4 max-w-[738px] w-full bg-post-bg-black">
            <div className="flex flex-row justify-center gap-3">
              <p className="text-center text-3xl text-white">
                Create New Post
              </p>
              <img
                src="../assets/img/sendPost.svg"
                alt="new post"
                className="h-10 w-10"
              />
            </div>

            <NewPost />
          </div>
          <div className="mt-0 bg-post-bg-black">
            <div className="my-4 flex justify-end">
              <div
                className="h-10 w-10 cursor-pointer transition-all ease-in-out fill-white hover:fill-red-secondary "
                onClick={() => navigate('/')}
                title="Close"
              >
                <PostCloseSVG />
              </div>
            </div>

            {data && <AuthorCard authorId={data?._id} />}
            <Trending isHome={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
