import { FC } from "react";
import { useLogin, useDetectOutsideClick, useDropDown } from "./index.hook";
import { LoginSVG, NotificationSVG } from "../../components";
import { UserIconDropDown } from "./components/UserIconDropDown";

interface User {
  username: string;
  email: string;
  isDeleted: boolean;
  introduction: string;
  _id: string;
  avatar: string;
  backgroundCover: string;
}

interface NavbarProp {
  setPresentLogin:React.Dispatch<React.SetStateAction<boolean>>;
}

//TODO: user api && persistent login
export const Navbar: FC<NavbarProp> = ({setPresentLogin}): JSX.Element => {
  // const [isPresentLogin, setPresentLogin] = useState<boolean>(false);
  const { isLoggedIn, userLogin, userLogout } = useLogin();
  const { userRef, dropdown, setUserDropDown, toggleUserDropDown, userData } =
  useDropDown();
  useDetectOutsideClick(userRef, setUserDropDown);

  const presentLogin:Function = ():Function => {
    return () => {
      setPresentLogin(true);
    };
  };

  return (
    <div className="sticky flex items-center justify-start top-0 flex-1 h-[56px] w-full gap-8 px-4 mx-auto drop-shadow-md bg-secondary-black">
      <div className="flex items-center text-white ">
        <span className="sr-only">Home</span>
        <div className="h-full font-gemini text-3xl m-2">BrainLeak</div>
      </div>

      <div className="relative mx-auto">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <input
          type="search"
          className="block p-4 pl-10 w-[200px] h-5 text-sm leading-normal bg-primary-black rounded-lg placeholder-zinc-400 text-white"
          placeholder="Search a post..."
        />
      </div>

      {isLoggedIn && (
        <div className="cursor-pointer">
          <NotificationSVG />
        </div>
      )}

      {!isLoggedIn && (
        <div
          className="flex px-2 py-1 pt-[5px] text-sm font-medium rounded-md border-[1px] cursor-pointer transition text-black bg-white hover:bg-primary-black hover:text-white hover:border-white"
          // onClick={userLogin()}
          onClick={presentLogin()}
        >
          Login
          <div className="ml-0.5">
            <LoginSVG />
          </div>
        </div>
      )}

      {isLoggedIn && (
        <UserIconDropDown
          userRef={userRef}
          dropdown={dropdown}
          userData={userData}
          toggleUserDropDown={toggleUserDropDown}
          userLogout={userLogout}
        />
      )}
    </div>
  );
};
