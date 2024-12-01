export default function (date: string) {
  const [day, month, year] = date.split('/')
  return new Date(`${year}-${month}-${day}`) < new Date()
}
