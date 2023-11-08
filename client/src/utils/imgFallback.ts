import { ReactElement } from 'react';

export const fallback = (ev: any) => {
  ev.target.src = '../assets/img/testUserPic.jpeg';
};
