export default function (errorMessage: string) {
  const { openSnackbar } = useSnackbar()
  openSnackbar(errorMessage || 'Houve um erro inesperado.', 'error')
}
