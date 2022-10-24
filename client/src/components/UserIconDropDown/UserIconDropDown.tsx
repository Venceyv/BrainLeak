import { FC } from 'react';

interface User {
  username: string;
  email: string;
  isDeleted: boolean;
  introduction: string;
  _id: string;
  avatar: string;
  backgroundCover: string;
}

interface DropDownProp {
  userRef: React.MutableRefObject<HTMLDivElement>;
  dropdown: boolean;
  userData: User;
  toggleUserDropDown: () => void;
  userLogout: () => () => void;
}

export const UserIconDropDown: FC<DropDownProp> = ({ userRef, dropdown, userData, toggleUserDropDown, userLogout }): JSX.Element => {
  return (
    <div className="relative flex flex-col">
      <img
        className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer text-zinc-50"
        src="../../assets/img/testUserPic.jpeg"
        alt="user"
        id="user-img"
        onClick={toggleUserDropDown}
      />

      {dropdown && (
        <div
          ref={userRef}
          className="flex-col items-center gap-y-3 absolute w-60 top-[46px] right-[-16px] border-[1px] transition bg-secondary-black border-zinc-700"
        >
          <div className="flex flex-col items-center p-2 border-b-[1px] border-zinc-700 w-full">
            <img
              className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer text-zinc-50"
              src="../../assets/img/testUserPic.jpeg"
              alt="user"
            />

            <div className="align overflow-hidden text-ellipsis h-fit text-zinc-50">Venceyv</div>
          </div>
          <ul className="mb-2 text-center w-full">
            <li className="w-full text-opacity-[0.6] hover:marker hover:text-opacity-100 mt-2 cursor-pointer transition text-zinc-50 ">
              Profile
            </li>
            <li
              onClick={userLogout()}
              className="mt-2 w-full text-opacity-[0.6] hover:marker hover:text-opacity-100 cursor-pointer transition text-zinc-50"
            >
              Sign out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
