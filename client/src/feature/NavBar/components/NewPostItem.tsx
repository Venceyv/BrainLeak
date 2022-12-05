import { FC } from 'react';
import { NotificationSVG } from '../../../components';
import { NewPostSVG } from '../../../components/NewPostSVG';

export const NewPostItem: FC = (): JSX.Element => {
  return (
    <div
      className="fill-white hover:fill-red-secondary transition-all ease-in-out cursor-pointer"
      title="New post"
    >
      <NewPostSVG />
    </div>
  );
};
