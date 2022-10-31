import { useEffect } from 'react';
import { getCheckAuth } from '../../api/userAPI';
import { getUserId } from '../../utils/getLocalStorage';

interface useCheckAuthParam {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
  avatar: string;
  backgroundCover: string;
  introduction: string;
  username: string;
  _id: string;
}

export const useCheckAuth = ({ setLogin }: useCheckAuthParam): void => {
  useEffect(() => {
    const checkUserAuth = async (userId: string): Promise<void> => {
      const data = await getCheckAuth(userId);

      if (data) {
        setLogin(true);
      }
    };

    const userId: string = getUserId();
    if (userId !== null) {
      checkUserAuth(userId);
    }
  }, []);
};
