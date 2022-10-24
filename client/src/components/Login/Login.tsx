import { FC } from 'react';

const LoginButton: FC = (): JSX.Element => {
  return (
    <button
      type="button"
      className="group flex flex-row justify-center items-center gap-2 border-2 p-1 rounded-xl w-[260px] transition ease-in-out hover:border-primary-black hover:bg-white border-white"
    >
      <svg
        className="group-hover:border-secondary-black border-2 rounded-full transition ease-in-out border-white"
        viewBox="0 0 1024 1024"
        width="28"
        height="28"
      >
        <path
          className="transition ease-in-out group-hover:fill-secondary-black"
          d="M512 938.666667h-18.346667A433.493333 433.493333 0 0 1 85.333333 524.373333a426.666667 426.666667 0 0 1 602.453334-401.493333 63.146667 63.146667 0 0 1 32.853333 36.693333 62.72 62.72 0 0 1-4.266667 49.493334L661.333333 310.613333a61.44 61.44 0 0 1-78.08 27.306667A192 192 0 0 0 374.186667 384a188.16 188.16 0 0 0-49.493334 142.506667 186.026667 186.026667 0 0 0 70.826667 128 192.853333 192.853333 0 0 0 147.2 42.666666 165.973333 165.973333 0 0 0 112.213333-66.986666h-123.733333A61.866667 61.866667 0 0 1 469.333333 568.746667v-114.346667a61.866667 61.866667 0 0 1 61.866667-61.866667h345.6A62.293333 62.293333 0 0 1 938.666667 453.973333v80.213334A426.666667 426.666667 0 0 1 512 938.666667z m0-768a341.333333 341.333333 0 0 0-341.333333 351.573333A346.453333 346.453333 0 0 0 497.066667 853.333333 341.333333 341.333333 0 0 0 853.333333 529.92V477.866667h-298.666666v67.413333h226.56l-17.493334 55.466667a256 256 0 0 1-209.066666 181.333333A280.746667 280.746667 0 0 1 341.333333 725.333333a270.08 270.08 0 0 1-30.72-396.8A278.186667 278.186667 0 0 1 597.333333 252.16l32.853334-61.013333A337.066667 337.066667 0 0 0 512 170.666667z"
          fill="#fff"
        ></path>
      </svg>

      <h1 className="text-lg transition ease-in-out group-hover:text-secondary-black text-white">Continue With Google</h1>
    </button>
  );
};

export const Login: FC = (): JSX.Element => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-4 w-[300px] rounded-xl p-2 border-2 ml-[35%] bg-secondary-black">
      <h1 className="w-fit text-5xl font-gemini mb-3 text-white">Login</h1>
      <LoginButton />
      <p className="text-xs text-center italic text-white">
        By continuing, you are agreeing to set up a BrainLeak account and agreeing to our User Agreement and Privacy Policy.
      </p>
      <img src="/assets/img/loginPictureLeft.png" alt="cat-left" className="absolute hidden right-[268px] top-[10px] w-32 xs:block" />
      <img src="/assets/img/loginPictureRight.png" alt="cat-right" className="absolute hidden left-[268px] bottom-[10px] w-32 xs:block" />
    </div>
  );
};
