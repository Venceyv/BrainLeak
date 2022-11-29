import { useInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { getSearch } from '../../../api/searchAPI';
import { Loading } from '../../../components/Loading';
import { NoMore } from '../../../components/NoMore';

export const Results: FC = (): JSX.Element => {
  const { searchParam } = useParams();
  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['postComment'],
    ({ pageParam = 1 }) => getSearch(searchParam!, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 10 ? undefined : allPages.length + 1;
      },
    }
  );

  if (isInitialLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  return (
    <div>
      <div className="mt-3">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage ? true : false}
          loader={<Loading key={0} width={'full'} height={'full'} />}
          useWindow={false}
        >
          {/* {isSuccess && data.pages.map(page => {
            return page.map(result => {
              return <PostAbstract />
            })
          })} */}
        </InfiniteScroll>
      </div>

      {!hasNextPage && <NoMore />}
    </div>
  );
};
