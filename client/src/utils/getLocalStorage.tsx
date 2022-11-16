export const getJWT: Function = (): string => {
  return JSON.parse(localStorage.getItem('jwt') as string);
};

export const getUserId = (): string => {
  return JSON.parse(localStorage.getItem('userId') as string);
};
