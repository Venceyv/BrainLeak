import { FC, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Post } from './ResultPost';
import { Loading } from '../../../components/Loading';
import { IntervalItem, MenuItem } from '../../../interfaces/post';
import InfiniteScroll from 'react-infinite-scroller';
import {
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { getSearch } from '../../../api/searchAPI';
import { NoResult } from './noResult';
import { NoMore } from '../../../components/NoMore';

interface PostsProp {
  selectedMenuItem: MenuItem;
}

export const Results: FC<PostsProp> = ({
  selectedMenuItem,
}): JSX.Element => {
  const location = useLocation();

  const getSearchParam = (): string => {
    if (location?.state?.query) {
      return location.state.query;
    } else {
      return decodeURIComponent(location.search.slice(3));
    }
  };

  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['userSearch', selectedMenuItem],
    ({ pageParam = 1 }) =>
      getSearch(pageParam, selectedMenuItem, getSearchParam()),
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
    <div>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage ? true : false}
        loader={<Loading key={0} width={'full'} height={'full'} />}
        // endMessage={<NoMore />}
      >
        {isSuccess &&
          data?.pages?.map((page) => {
            return page.map((post, index) => {
              const postProp = {
                title: post?.title,
                description: post?.description,
                like: post?.statistics?.likes,
                dislike: post?.statistics?.dislikes,
                date: post?.publishDate,
                _id: post?._id,
                marks: post?.statistics?.marks,
              };

              const userStatProp = {
                like: post?.like,
                dislike: post?.dislike,
                save: post?.save,
              };
              return (
                <Post
                  key={index}
                  user={post.author}
                  post={postProp}
                  like={userStatProp.like}
                  dislike={userStatProp.dislike}
                  save={userStatProp.save}
                />
              );
            });
          })}
      </InfiniteScroll>
      {data && data?.pages[0].length === 0 && <NoResult />}
      {data && data?.pages[0].length > 0 && !hasNextPage && (
        <NoMore />
      )}
    </div>
  );
};
