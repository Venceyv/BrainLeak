import { useGoogleLogin } from '../lib';
import { googleOAuth } from '../services/postApi';

const googleLogin = () =>
  useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await googleOAuth(code);
      console.log(tokens);
    },
    onError: async (err) => {
      console.log(err);
    },
    flow: 'auth-code',
  });

export const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 w-full">
      <div className="flex items-center h-16 max-w-screen-xl gap-8 px-4 mx-auto sm:px-6 lg:px-8">
        <div className="block text-white dark:text-teal-300">
          <span className="sr-only">Home</span>
          <img
            src="src/assets/1 (3).svg"
            width="40px"
            height="40px"
            alt="logo"
          />
        </div>

        <div className="flex items-center justify-end flex-1 md:justify-between">
          <nav className="hidden md:block" aria-labelledby="header-navigation">
            <h2 className="sr-only" id="header-navigation">
              Header navigation
            </h2>

            <ul className="flex items-center gap-6 text-sm">
              <li>
                <div className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 text-xl">
                  Test
                </div>
              </li>
            </ul>
          </nav>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
          {/* <div className="flex items-center gap-4"> */}
          <div className="sm:gap-4 sm:flex">
            <div
              className="block px-5 py-2.5 text-sm font-medium text-black bg-white hover:bg-gray-900 dark:hover:bg-gray-500 hover:text-white transition rounded-md cursor-pointer"
              onClick={googleLogin()}
            >
              Login
            </div>

            <button className="block p-2.5 text-gray-600 transition bg-gray-100 rounded md:hidden hover:text-gray-600/75 dark:text-white dark:bg-gray-800 dark:hover:text-white/75">
              <span className="sr-only">Toggle menu</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
