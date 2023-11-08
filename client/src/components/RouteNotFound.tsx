import { FC } from 'react';

export const RouteNotFound: FC = (): JSX.Element => {
  return (
    <div
      id="scroll-target-node"
      className="flex justify-center items-center w-full z-10 h-[calc(100%-56px)] bg-404-background"
    >
      <img
        className="object-cover"
        src="https://storage.googleapis.com/brainleak/404(astronaut).jpg"
        alt="404 not found"
      />
    </div>
  );
};

export default RouteNotFound;
