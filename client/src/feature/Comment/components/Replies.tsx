import { useInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { getReplies } from '../../../api/commentAPI';
import { Loading } from '../../../components/Loading';
import { IndividualComment } from './IndividualComment';
import { IndividualReply } from './IndividualReply';

interface RepliesType {
  commentId: string;
  currentUserId: string | null;
}

export const Replies: FC<RepliesType> = ({
  commentId,
  currentUserId,
}): JSX.Element => {
  const { postId } = useParams();
  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['postCommentReply'],
    ({ pageParam = 1 }) => getReplies(postId!, commentId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 2 ? undefined : allPages.length + 1;
      },
    }
  );

  if (isInitialLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  return (
    <div>
      {isSuccess &&
        data?.pages?.map((pages) => {
          return pages.map((reply, index) => {
            return commentId === reply.relatedComment ? (
              <IndividualReply
                key={reply._id}
                reply={reply}
                currentUserId={currentUserId}
              />
            ) : null;
          });
        })}
      {hasNextPage && (
        <button
          className="text-white"
          type="button"
          onClick={() => fetchNextPage()}
        >
          Load more...
        </button>
      )}

      {/* {data?.pages?.map((pages) => {
        return pages.map((reply, index) => {
          return commentId === reply.relatedComment ? (
            <IndividualReply key={index} {...reply} />
          ) : null;
        });
      })}
      {hasNextPage && (
        <button type="button" onClick={() => fetchNextPage()}>
          Load more...
        </button>
      )} */}
    </div>
  );
};
