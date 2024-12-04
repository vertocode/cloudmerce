export default function (host: string) {
  if (host.includes('localhost')) {
    return `http://${host}`
  }

  return `https://${host}`
}
