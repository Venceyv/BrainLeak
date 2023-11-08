import { FC, useEffect } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { useQueries, useQuery } from '@tanstack/react-query';
import { NewPost } from '../feature/NewPost';
import { getUserId } from '../utils/getLocalStorage';
import { getCheckAuth } from '../api/userAPI';
import { Trending } from '../feature/trending';
import { AuthorCard } from '../feature/AuthorCard';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PostCloseSVG } from '../components/PostCloseSVG';
import { getPost } from '../api/postAPI';
import { EditPost } from '../feature/EditPost';

export const EditPostPage: FC = (): JSX.Element => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const result = useQueries({
    queries: [
      {
        queryKey: ['checkUserAuth'],
        queryFn: () => getCheckAuth(getUserId()),
        retry: 0,
      },
      {
        queryKey: ['postData'],
        queryFn: () => getPost(postId),
        retry: 0,
      },
    ],
  });

  useEffect(() => {
    if (getUserId() === '') {
      navigate('/unauthorized');
    }
  }, []);

  if (
    result[0].isSuccess &&
    result[1].isSuccess &&
    result[1].data?.author._id !== result[0].data?._id
  ) {
    navigate('/unauthorized');
  }

  return (
    <div
      id="scroll-target-node"
      className="fixed inset-0 right-0 mt-[56px] flex items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto"
    >
      {result[1].data?.author._id === result[0].data?._id &&
        result[1] && (
          <div className=" absolute top-0 w-full h-full max-w-[1024px] z-10 bg-post-bg-black">
            <div className="flex flex-row items-start max-w-[1024px] bg-post-bg-black">
              <div className="p-4 max-w-[738px] w-full bg-post-bg-black">
                <div className="flex flex-row justify-center gap-3">
                  <p className="text-center text-3xl text-white">
                    Edit Your Post
                  </p>
                  <img
                    src="../assets/img/edit-page.svg"
                    alt="new post"
                    className="h-10 w-10"
                  />
                </div>

                {result[1].data && <EditPost post={result[1].data} />}
              </div>
              <div className="mt-0 bg-post-bg-black">
                <div className="my-4 flex justify-end">
                  <div
                    className="h-10 w-10 cursor-pointer transition-all ease-in-out fill-white hover:fill-red-secondary "
                    onClick={() => navigate(-1)}
                    title="Close"
                  >
                    <PostCloseSVG />
                  </div>
                </div>

                {result[0].data && (
                  <AuthorCard authorId={result[0].data?._id} />
                )}
                <Trending isHome={false} />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default EditPostPage;
