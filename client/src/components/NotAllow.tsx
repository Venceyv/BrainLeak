import { FC } from 'react';

export const NotAllow: FC<{ message: string | null }> = ({
  message,
}): JSX.Element => {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <img
        src="../assets/img/not-allow.webp"
        className="w-[160px] h-[150px]"
        alt="not allow"
      />
      <p className="text-lg text-white">
        {!message
          ? 'Only the owner of the profile can see this.'
          : message}
      </p>
    </div>
  );
};
