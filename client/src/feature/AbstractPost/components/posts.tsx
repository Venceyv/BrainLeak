import { FC, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Post } from './Post';
import { getPosts } from '../../../api/postAPI';
import { Loading } from '../../../components/Loading';
import { IntervalItem, MenuItem } from '../../../interfaces/post';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import { NoMore } from '../../../components/NoMore';
import { PostWithCover } from './PostWithCover';

interface PostsProp {
  selectedMenuItem: MenuItem;
  selectedTimeInterval: IntervalItem;
}

export const Posts: FC<PostsProp> = ({
  selectedMenuItem,
  selectedTimeInterval,
}): JSX.Element => {
  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['posts', selectedMenuItem, selectedTimeInterval],
    ({ pageParam = 1 }) =>
      getPosts(pageParam, selectedMenuItem, selectedTimeInterval),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length >= 10
          ? allPages.length + 1
          : undefined;
      },
    }
  );

  if (isInitialLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  return (
    <>
      <div>
        <>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage ? true : false}
            loader={
              <Loading key={0} width={'full'} height={'full'} />
            }
            // endMessage={<NoMore />}
          >
            {isSuccess &&
              data?.pages?.map((page) => {
                return page.map((post, index) => {
                  const postProp = {
                    title: post?.title!,
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
                  return !post.cover ? (
                    <Post
                      key={index}
                      user={post.author}
                      post={postProp}
                      like={userStatProp.like}
                      dislike={userStatProp.dislike}
                      save={userStatProp.save}
                    />
                  ) : (
                    <PostWithCover
                      key={post._id}
                      user={post.author}
                      post={postProp}
                      like={userStatProp.like}
                      dislike={userStatProp.dislike}
                      save={userStatProp.save}
                      cover={post.cover}
                    />
                  );
                });
              })}
          </InfiniteScroll>
        </>
      </div>

      {!hasNextPage && <NoMore />}
    </>
  );
};
