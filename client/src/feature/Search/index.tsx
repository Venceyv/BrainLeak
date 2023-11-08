import { FC, useState } from 'react';
import { ResultPostFilterBar } from './components/ResultPostFilterBar';
import { IntervalItem, MenuItem } from '../../interfaces/post';
import { Results } from './components/Results';

export const UserSearch: FC = (): JSX.Element => {
  // const { data, isLoading, isSuccess } = useQuery(['posts'], () => getPosts(1, 5));
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<MenuItem>('hot');

  // if (isLoading) {
  //   return <Loading width={80} height={500} />;
  // }

  return (
    <div className="h-full w-full bg-primary-black">
      <ResultPostFilterBar
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={setSelectedMenuItem}
      />
      <Results selectedMenuItem={selectedMenuItem} />
    </div>
  );
};
