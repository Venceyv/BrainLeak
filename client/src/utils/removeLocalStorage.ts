export const clearUser: Function = (): void => {
  localStorage.removeItem('userId');
  localStorage.removeItem('jwt');
};
