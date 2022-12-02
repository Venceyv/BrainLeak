import { useEffect } from 'react';
import { getCheckAuth } from './api/userAPI';
import { LikeThumb } from './components/LikeThumb';

export const Test = () => {
  return <LikeThumb isTrue={true} />;
};
