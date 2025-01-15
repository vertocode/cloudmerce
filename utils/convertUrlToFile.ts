export default async (url: string, fileName: string) => {
  if (import.meta.client) {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
  }
}
