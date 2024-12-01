export default function (warningMessage: string) {
  const { openSnackbar } = useSnackbar()
  openSnackbar(warningMessage, 'warning')
}
