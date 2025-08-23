import { toast } from "react-hot-toast";

  export const showSuccessToast = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
    });
  };

  export const showErrorToast = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
    });
  };

  export const showLoadingToast = (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
    });
  };

  export const dismissToast = (toastId: any) => {
    toast.dismiss(toastId);
  };
