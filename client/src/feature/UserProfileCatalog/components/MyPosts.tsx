import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { getUserPosts } from '../../../api/postAPI';
import { getUser } from '../../../api/userAPI';
import { Loading } from '../../../components/Loading';
import { NoMore } from '../../../components/NoMore';
import { Post } from './Post';
import { MyPostWithCover } from './MyPostWithCover';

export const MyPosts: FC = () => {
  const { userId } = useParams();

  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['userPosts'],
    ({ pageParam = 1 }) => getUserPosts(userId!, pageParam, 'new'),
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

  // return <div>{data && <UserInfo {...data} />}</div>;
  return (
    <div className="flex flex-col">
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
                />
              );
            });
          })}
      </InfiniteScroll>
      {!hasNextPage && <NoMore />}
    </div>
  );
};
