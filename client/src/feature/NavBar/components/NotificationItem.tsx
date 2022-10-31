import { FC } from 'react';
import { NotificationSVG } from '../../../components';

export const NotificationItem: FC = (): JSX.Element => {
  return (
    <div className="cursor-pointer">
      <NotificationSVG />
    </div>
  );
};
