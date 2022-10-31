import { useQuery } from '@tanstack/react-query';
import { FC, Suspense, useEffect } from 'react';
import { getCheckAuth } from '../../../api/userAPI';
import { UserIcon } from '../../../components';
import { getUserId } from '../../../utils/getLocalStorage';
import { UserDropdown } from './UserDropdown';
import { useDetectOutsideClick, useDropdown } from './UserItem.hook';

interface UserItemProp {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserItem: FC<UserItemProp> = ({ setLogin }): JSX.Element => {
  const { userRef, isDropdown, toggleUserDropdown, setUserDropdown } = useDropdown();
  useDetectOutsideClick(userRef, setUserDropdown);

  const { data: { data: { dbBack: userData = {} } = {} } = {}, refetch } = useQuery(
    ['user', getUserId],
    async () => await getCheckAuth(getUserId()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <button onClick={toggleUserDropdown} type="button">
        <UserIcon imgURL={userData?.avatar} />
      </button>

      {isDropdown && <UserDropdown userRef={userRef} toggleUserDropdown={toggleUserDropdown} setLogin={setLogin} />}
    </>
  );
};
