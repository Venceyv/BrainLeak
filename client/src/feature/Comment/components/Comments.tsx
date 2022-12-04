import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { getComments } from '../../../api/commentAPI';
import { IndividualComment } from './IndividualComment';
import { Loading } from '../../../components/Loading';
import InfiniteScroll from 'react-infinite-scroller';
import { NoMore } from '../../../components/NoMore';
import { CommentSortBar } from './CommentSortBar';

interface CommentsProp {
  postId: string;
  currentUserId: string | null;
}

export type SortByType = 'new' | 'hot' | 'top';

export const Comments: FC<CommentsProp> = ({
  postId,
  currentUserId,
}): JSX.Element => {
  const [sortBy, setSortBy] = useState<SortByType>('new');

  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['postComment', sortBy],
    ({ pageParam = 1 }) => getComments(postId, pageParam, sortBy),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 10 ? undefined : allPages.length + 1;
      },
      cacheTime: 0,
    }
  );

  if (isInitialLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  return (
    <div className="flex flex-col gap-1">
      <CommentSortBar sortBy={sortBy} setSortBy={setSortBy} />
      <div className="mt-3">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage ? true : false}
          loader={<Loading key={0} width={'full'} height={'full'} />}
          useWindow={false}
        >
          {isSuccess &&
            data?.pages?.map((comments) => {
              return comments.map((comment, index) => {
                return (
                  <IndividualComment
                    key={index}
                    comment={comment}
                    currentUserId={currentUserId}
                  />
                );
              });
            })}
        </InfiniteScroll>
      </div>

      {!hasNextPage && <NoMore />}
    </div>
  );
};
