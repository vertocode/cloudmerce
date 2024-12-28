export default function (date: string): string {
  console.log('date received: ', date)
  /**
     * Receives a date string in this format: 2024-12-27T23:41:30.447Z
     * Returns a formatted date string in this format: 27/12/2024
     */
  const parsedDate = new Date(date)

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format')
  }

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = parsedDate.getFullYear()

  return `${day}/${month}/${year}`
}
