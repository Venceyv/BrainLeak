const URL: string = import.meta.env.VITE_URL ?? '';
// const URL: string = 'http://localhost:3000';
const USER_PATH: string = import.meta.env.VITE_USER_PATH ?? '';
const CLIENT_ID: string = import.meta.env.VITE_CLIENT_ID ?? '';

console.log(URL);
export { URL, USER_PATH, CLIENT_ID };
