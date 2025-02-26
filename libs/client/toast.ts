import { Bounce, toast } from 'react-toastify';

type TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';

interface ShowPromiseToast {
  pending: string;
  success: string;
  error: string;
}

export const showToast = (message: string, type: TypeOptions = 'default') => {
  toast(message, {
    type,
    position: 'bottom-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};

export const showPromiseToast = (
  data: Promise<unknown>,
  { error, pending, success }: ShowPromiseToast
) => {
  return toast.promise(
    data,
    {
      pending,
      success,
      error,
    },
    {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    }
  );
};
