import { FC, useEffect, useState } from 'react';
import { UserItem } from './components/UserItem';
import { SearchItem } from './components/SearchItem';
import { NotificationItem } from './components/NotificationItem';
import { LoginItem } from './components/LoginItem';
import { useCheckAuth } from './index.hook';
import { useNavigate, useParams } from 'react-router-dom';

export const NavBar: FC = (): JSX.Element => {
  const [isLoggedIn, setLogin] = useState<boolean>(false);
  useCheckAuth({ setLogin });
  const navigate = useNavigate();

  return (
    <div className="sticky flex items-center justify-start top-0 flex-1 h-[56px] w-full gap-8 px-4 mx-auto drop-shadow-md z-50 bg-secondary-black">
      <div
        className="flex items-center cursor-pointer text-white "
        onClick={() => navigate('')}
      >
        <span className="sr-only">Home</span>
        <div className="h-full font-gemini text-3xl m-2">
          BrainLeak
        </div>
      </div>
      <SearchItem />
      {isLoggedIn && <NotificationItem />}
      {isLoggedIn && <UserItem setLogin={setLogin} />}
      {!isLoggedIn && <LoginItem setLogin={setLogin} />}
    </div>
  );
};
