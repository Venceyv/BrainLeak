import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { getCheckAuth } from '../../../api/userAPI';
import { UserIcon } from '../../../components';
import { getUserId } from '../../../utils/getLocalStorage';
import { UserDropdown } from './UserDropdown';
import { useDetectOutsideClick, useDropdown } from './UserItem.hook';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './UserItem.css';

interface UserItemProp {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserItem: FC<UserItemProp> = ({
  setLogin,
}): JSX.Element => {
  const { userRef, isDropdown, toggleUserDropdown, setUserDropdown } =
    useDropdown();
  useDetectOutsideClick(userRef, setUserDropdown);

  const { data, refetch } = useQuery(
    ['user', getUserId],
    () => getCheckAuth(getUserId()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (getUserId()) {
      refetch();
    }
  }, []);

  return (
    <>
      <Popup
        trigger={
          <button onClick={toggleUserDropdown} type="button">
            <UserIcon imgURL={data?.avatar} />
          </button>
        }
        position="bottom right"
        arrow={false}
        open={isDropdown}
        onClose={() => toggleUserDropdown}
      >
        <UserDropdown
          userRef={userRef}
          toggleUserDropdown={toggleUserDropdown}
          setLogin={setLogin}
          userData={data}
        />
      </Popup>
    </>
  );
};
