export default function (value: string) {
  const colorRegex = /^X?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/
  return colorRegex.test(value)
}
