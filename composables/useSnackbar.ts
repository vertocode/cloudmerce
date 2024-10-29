import { useState } from 'nuxt/app'

export const useSnackbar = () => {
    const timeout = 3000
    const snackbar = useState('snackbar', () => ({
        open: false,
        message: '',
        variant: 'info' as 'error' | 'warning' | 'info' | 'success',
    }));

    const openSnackbar = (message: string, variant: 'error' | 'warning' | 'info' | 'success') => {
        snackbar.value.open = true;
        snackbar.value.message = message;
        snackbar.value.variant = variant;

        setTimeout(() => {
            snackbar.value.open = false;
        }, timeout);
    };

    return { snackbar: snackbar.value, timeout, openSnackbar }
}
