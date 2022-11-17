import toast from 'react-hot-toast';

export const errorToast = (errorMessage: string = 'Oops! Something went wrong.') =>
  toast.error(errorMessage, {
    style: {
      border: '2px solid white',
      background: '#181818',
      color: 'white',
    },
    position: 'top-right',
  });
