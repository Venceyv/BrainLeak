import { useQueries, useQuery } from '@tanstack/react-query';
import { FC, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCheckAuth, getUser } from '../../api/userAPI';
import { NotAllow } from '../../components/NotAllow';
import { queryKeys } from '../../data/queryKeys';
import { getUserId } from '../../utils/getLocalStorage';
import MyBookmarked from './components/MyBookmarked';
import MyComment from './components/MyComment';
import MyLiked from './components/MyLiked';
import MyPosts from './components/MyPosts';
import { ProfileMenu } from './components/ProfileMenu';
import { SelectedMenu } from './components/SelectedMenu';

type menuCategory =
  | 'my-posts'
  | 'bookmarked'
  | 'liked-posts'
  | 'comment-history';

export const ProfileCatalog: FC<{ isDelete: boolean }> = ({
  isDelete,
}) => {
  const { userId } = useParams();

  const [menuCategory, setMenuCategory] =
    useState<menuCategory>('my-posts');

  const result = useQueries({
    queries: [
      { queryKey: ['userData'], queryFn: () => getUser(userId!) },
      {
        queryKey: ['checkUserAuth'],
        queryFn: () => getCheckAuth(getUserId()),
        retry: 0,
      },
    ],
  });

  const isAuthor =
    result[0] &&
    result[1] &&
    result[0]?.data?._id === result[1]?.data?._id;
  const showPosts = menuCategory === 'my-posts';
  const showBookmarked = isAuthor && menuCategory === 'bookmarked';
  const showLiked = isAuthor && menuCategory === 'liked-posts';
  const showComment = isAuthor && menuCategory === 'comment-history';

  return (
    <div className="col-start-3 col-span-3">
      <ProfileMenu setMenuCategory={setMenuCategory} />
      {!isDelete && (
        <div>
          {showPosts && <MyPosts />}
          {showBookmarked && <MyBookmarked />}
          {showLiked && <MyLiked />}
          {showComment && <MyComment />}
          {!showPosts && !isAuthor && <NotAllow message={null} />}
        </div>
      )}
      {isDelete && (
        <NotAllow message={'This user deactivated the account.'} />
      )}
    </div>
  );
};
