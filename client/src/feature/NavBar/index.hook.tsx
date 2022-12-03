import { useEffect } from 'react';
import { getCheckAuth } from '../../api/userAPI';
import { getUserId } from '../../utils/getLocalStorage';
import { User } from '../../interfaces/user';
import { clearUser } from '../../utils/removeLocalStorage';

interface useCheckAuthParam {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCheckAuth = ({
  setLogin,
}: useCheckAuthParam): void => {
  useEffect(() => {
    const checkUserAuth = async (userId: string): Promise<void> => {
      const userData: User | undefined = await getCheckAuth(userId);
      if (userData) {
        setLogin(true);
      }
    };

    const userId: string | null = getUserId();
    if (userId !== null) {
      checkUserAuth(userId);
    } else {
      clearUser();
    }
  }, []);
};
