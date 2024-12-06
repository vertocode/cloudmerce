export default function (errorMessage: string) {
  if (import.meta.client) {
    const { openSnackbar } = useSnackbar()
    openSnackbar(errorMessage || 'Houve um erro inesperado.', 'error')
  }
}
