import { FC } from 'react';
import { postLogOut } from '../../../api/oAuthAPI';
import { User } from '../../../interfaces/user';

interface UserDropdownProp {
  userRef: React.MutableRefObject<HTMLDivElement>;
  toggleUserDropdown: React.MouseEventHandler<HTMLElement>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userData: User | undefined;
}

export const UserDropdown: FC<UserDropdownProp> = ({ userRef, toggleUserDropdown, setLogin, userData }): JSX.Element => {
  const userLogout = async (): Promise<void> => {
    try {
      await postLogOut();

      localStorage.removeItem('jwt');
      localStorage.removeItem('userId');
      setLogin(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div ref={userRef} className="flex-col items-center gap-y-3 absolute w-60 top-[56px] right-0 border-[1px] transition bg-secondary-black border-zinc-700">
      <div className="flex flex-col items-center p-2 border-b-[1px] border-zinc-700 w-full">
        <img
          className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer text-zinc-50"
          src={userData?.avatar}
          alt="user"
        />

        <div className="align overflow-hidden text-ellipsis h-fit text-zinc-50">{userData?.username}</div>
      </div>
      <ul className="mb-2 text-center w-full">
        <li onClick={toggleUserDropdown} className="w-full text-opacity-[0.6] hover:marker hover:text-opacity-100 mt-2 cursor-pointer transition text-zinc-50 ">
          Profile
        </li>
        <li onClick={userLogout} className="mt-2 w-full text-opacity-[0.6] hover:marker hover:text-opacity-100 cursor-pointer transition text-zinc-50">
          Sign out
        </li>
      </ul>
    </div>
  );
};
