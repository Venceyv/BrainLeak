import { FC, useState } from 'react';
import { PostFilterBar } from './components/PostFilterBar';
import { Posts } from './components/posts';
import { IntervalItem, MenuItem } from '../../interfaces/post';

export const AbstractPost: FC = (): JSX.Element => {
  // const { data, isLoading, isSuccess } = useQuery(['posts'], () => getPosts(1, 5));
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>('hot');
  const [selectedTimeInterval, setSelectedTimeInterval] =
    useState<IntervalItem>('today');

  // if (isLoading) {
  //   return <Loading width={80} height={500} />;
  // }

  return (
    <div className="h-full w-full bg-primary-black">
      <PostFilterBar
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={setSelectedMenuItem}
        setSelectedTimeInterval={setSelectedTimeInterval}
      />
      <Posts
        selectedMenuItem={selectedMenuItem}
        selectedTimeInterval={selectedTimeInterval}
      />
      {/* <Loading width={'full'} height={'[500px]'} /> */}
      {/* <div>
        {data?.map((post, index) => {
          const postProp = {
            title: post.title,
            description: post.description,
            like: post.statistics.likes,
            dislike: post.statistics.dislikes,
            date: post.publishDate,
            _id: post._id,
          };
          return <Post key={index} user={post.author} post={postProp} />;
        })}
      </div> */}
    </div>
  );
};
