import { FC } from 'react';

export const NotFound404: FC = (): JSX.Element => {
  return (
    <div
      id="scroll-target-node"
      className="fixed flex items-start inset-0 right-0 mt-[56px] justify-center w-full z-10 h-[calc(100%-56px)] bg-404-background"
    >
      <img
        className="object-cover"
        src="https://storage.googleapis.com/brainleak/404(cat).jpg"
        alt="404 not found"
      />
    </div>
  );
};
