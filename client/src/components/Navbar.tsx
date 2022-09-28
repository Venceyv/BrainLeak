import react from "react";

export const Navbar = () => {

  

  return (
    <nav className="bg-white dark:bg-gray-900 w-full">
      <div className="flex items-center h-16 max-w-screen-xl gap-8 px-4 mx-auto sm:px-6 lg:px-8">
        <div className="block text-white dark:text-teal-300">
          <span className="sr-only">Home</span>
          <img src="src/assets/logo.svg" width="64px" height="64px" alt="logo" />
        </div>

        <div className="flex items-center justify-end flex-1 md:justify-between">
          <nav className="hidden md:block" aria-labelledby="header-navigation">
            <h2 className="sr-only" id="header-navigation">
              Header navigation
            </h2>

            <ul className="flex items-center gap-6 text-sm">
              <li>
                <div
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                >
                  About
                </div>
              </li>

              <li>
                <div
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                >
                  Careers
                </div>
              </li>

              <li>
                <div
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                >
                  History
                </div>
              </li>

              <li>
                <div
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                >
                  Services
                </div>
              </li>

              <li>
                <div
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                >
                  Projects
                </div>
              </li>

              <li>
                <div
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                >
                  Blog
                </div>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:gap-4 sm:flex">
              <div
                className="block px-5 py-2.5 text-sm font-medium text-black bg-white hover:bg-gray-900 dark:hover:bg-gray-500 hover:text-white transition rounded-md"
              >
                Login
              </div>

              <div
                className="hidden xl:block lg:block sm:hidden md:block lg:px-5 py-2.5 text-sm font-medium text-teal-600 bg-gray-100 rounded-md hover:text-teal-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75 transition"
              >
                Register
              </div>
            </div>

            <button className="block p-2.5 text-gray-600 transition bg-gray-100 rounded md:hidden hover:text-gray-600/75 dark:text-white dark:bg-gray-800 dark:hover:text-white/75">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
