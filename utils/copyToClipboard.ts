export default function (text: string) {
  if (import.meta.client) {
    return navigator.clipboard.writeText(text)
  }
}
