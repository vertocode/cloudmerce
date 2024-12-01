export default function (successMessage: string) {
  const { openSnackbar } = useSnackbar()
  openSnackbar(successMessage, 'success')
}
