export default function (successMessage: string) {
  if (import.meta.client) {
    const { openSnackbar } = useSnackbar()
    openSnackbar(successMessage, 'success')
  }
}
