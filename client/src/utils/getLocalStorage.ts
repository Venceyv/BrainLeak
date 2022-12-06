export const getJWT: Function = (): string | null => {
  const jwt = localStorage.getItem('jwt') as string;

  return jwt ? JSON.parse(jwt) : null;
};

export const getUserId = (): string | null => {
  const userId = localStorage.getItem('userId') as string;
  return userId ? JSON.parse(userId) : '';
};
