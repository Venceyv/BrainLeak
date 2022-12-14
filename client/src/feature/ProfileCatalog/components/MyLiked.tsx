import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { Post } from './Post';
import { MyPostWithCover } from './MyPostWithCover';
import { getMyLikedPost, getMyPosts } from '../../../api/postAPI';
import { Loading } from '../../../components/Loading';
import { NoMore } from '../../../components/NoMore';
import { SortByMenu } from './SortByMenu';

type SortByType = 'hot' | 'new' | 'top';

export const MyLiked: FC = () => {
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
    ({ pageParam = 1 }) => getMyLikedPost(userId!, pageParam, sortBy),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length >= 10
          ? allPages.length + 1
          : undefined;
      },
      cacheTime: 0,
      staleTime: 0,
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
    <div className="flex flex-col">
      <SortByMenu sortBy={sortBy} setSortBy={setSortBy} />
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
                  useAvatar={true}
                />
              ) : (
                <MyPostWithCover
                  key={index}
                  user={post.author}
                  post={postProp}
                  like={userStatProp.like}
                  dislike={userStatProp.dislike}
                  save={userStatProp.save}
                  cover={post.cover}
                  useAvatar={true}
                />
              );
            });
          })}
      </InfiniteScroll>
      {!hasNextPage && <NoMore />}
    </div>
  );
};

export default MyLiked;
