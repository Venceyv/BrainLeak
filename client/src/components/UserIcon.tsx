import { FC, Suspense } from 'react';

export const UserIcon: FC<{ imgURL: string | undefined }> = ({
  imgURL,
}): JSX.Element => {
  return (
    <img
      className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-2 cursor-pointer text-zinc-50"
      src={imgURL || './assets/img/userPlaceholder.png'}
      alt="user"
      id="user-img"
    />
  );
};
