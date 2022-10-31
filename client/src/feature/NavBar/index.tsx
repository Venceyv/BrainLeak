import { FC, useState } from 'react';
import { UserItem } from './components/UserItem';
import { SearchItem } from './components/SearchItem';
import { NotificationItem } from './components/NotificationItem';
import { LoginItem } from './components/LoginItem';
import { useCheckAuth } from './index.hook';

export const NavBar: FC = (): JSX.Element => {
  const [isLoggedIn, setLogin] = useState<boolean>(false);
  useCheckAuth({ setLogin });

  return (
    <div className="sticky flex items-center justify-start top-0 flex-1 h-[56px] w-full gap-8 px-4 mx-auto drop-shadow-md bg-secondary-black">
      <div className="flex items-center text-white ">
        <span className="sr-only">Home</span>
        <div className="h-full font-gemini text-3xl m-2">BrainLeak</div>
      </div>
      <SearchItem />
      {isLoggedIn && <NotificationItem />}
      {isLoggedIn && <UserItem setLogin={setLogin} />}
      {!isLoggedIn && <LoginItem setLogin={setLogin} />}
    </div>
  );
};
