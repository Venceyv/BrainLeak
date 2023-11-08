import { FC } from 'react';

export const Unauthorized: FC = (): JSX.Element => {
  return (
    <div
      id="scroll-target-node"
      className="fixed flex items-start inset-0 right-0 mt-[56px] justify-center w-full z-10 h-[calc(100%-56px)] bg-404-background"
    >
      <div className="flex flex-col justify-center min-w-[682px]">
        <img
          className="object-cover"
          src="../assets/img/unauth.png"
          alt="401 Unauthorized"
        />
        <h1 className="text-center text-4xl text-white">
          401 Unauthorized
        </h1>
      </div>
    </div>
  );
};

export default Unauthorized;
