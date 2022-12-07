import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { Post } from './Post';
import { MyPostWithCover } from './MyPostWithCover';
import { getMyPosts } from '../../api/postAPI';
import { Loading } from '../../components/Loading';
import { NoMore } from '../../components/NoMore';
import { SortByMenu } from './SortByMenu';
import { getMyComments } from '../../api/commentAPI';
import { IndividualComment } from '../Comment/components/IndividualComment';
import { Comment } from './Comment';

type SortByType = 'hot' | 'new' | 'top';

export const MyPosts: FC = () => {
  const { userId } = useParams();

  const [sortBy, setSortBy] = useState<SortByType>('new');

  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['userPosts', sortBy],
    ({ pageParam = 1 }) => getMyComments(userId!, pageParam, sortBy),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length >= 10
          ? allPages.length + 1
          : undefined;
      },
      cacheTime: 0,
    }
  );

  if (isInitialLoading) {
    return (
      <div className="flex flex-col">
        <Loading width={'full'} height={'full'} />
      </div>
    );
  }

  return (
    <div className="">
      <SortByMenu sortBy={sortBy} setSortBy={setSortBy} />
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage ? true : false}
        loader={<Loading key={0} width={'full'} height={'full'} />}
      >
        {isSuccess &&
          data?.pages?.map((comments) => {
            return comments.map((comment, index) => {
              return <Comment key={index} comment={comment} />;
            });
          })}
      </InfiniteScroll>
      {!hasNextPage && <NoMore />}
    </div>
  );
};

export default MyPosts;
