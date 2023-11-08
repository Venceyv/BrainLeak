import { FC } from 'react';
import { NotificationSVG } from '../../../components';

export const NotificationItem: FC = (): JSX.Element => {
  return (
    <div
      className="fill-white hover:fill-red-secondary transition-all ease-in-out cursor-pointer"
      title="Notification"
    >
      <NotificationSVG />
    </div>
  );
};
