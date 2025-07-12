import {toast} from 'react-toastify';
export const showSuccess = (message = "Success") => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

export const showError = (message = "Something went wrong") => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};