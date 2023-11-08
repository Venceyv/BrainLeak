import { useInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useNavigate } from 'react-router-dom';
import { getUserFollowers } from '../../../api/userAPI';
import { Loading } from '../../../components/Loading';
import { User } from '../../../interfaces/user';
import { UserNavigatables } from './UserNavigatables';

export const UserFollowList: FC<User> = (user) => {
  const navigate = useNavigate();

  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getFollowers'],
    ({ pageParam = 1 }) => getUserFollowers(user._id, pageParam),
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
    return <Loading width={'full'} height={'full'} />;
  }

  return (
    <div className="flex flex-row justify-center items-center h-full w-full ">
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage ? true : false}
        loader={<Loading key={0} width={'full'} height={'full'} />}
      >
        {isSuccess &&
          data?.pages?.map((page) => {
            return page
              .filter((follower) => {
                return !follower.isDelete;
              })
              .map((follower) => {
                return (
                  <UserNavigatables
                    key={follower._id}
                    {...follower}
                  />
                );
              });
          })}
      </InfiniteScroll>
    </div>
  );
};
