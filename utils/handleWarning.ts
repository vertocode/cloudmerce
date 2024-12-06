export default function (warningMessage: string) {
  if (import.meta.client) {
    const { openSnackbar } = useSnackbar()
    openSnackbar(warningMessage, 'warning')
  }
}
