export const useUpload = () => {
  const { post } = useApi()

  /**
   * Upload an image with retry logic for 500 errors
   * @param file - The file to upload
   * @param retries - Number of retries (default: 5)
   * @param attempt - Current attempt number (used internally)
   */
  const upload = async (file: File, retries = 5, attempt = 1): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await post('/upload-image', formData, { useFormData: true }) as {
        data: {
          link: string // imgur
          url: string // imgBB
        }
      }

      const { url } = response?.data || {}

      // Imgur's validation
      // if (!link) {
      //   throw new Error(`Error to upload the image with name: ${file?.name || 'unknown'}`)
      // }

      // ImgBB validation
      if (!url) {
        throw new Error(`Error to upload the image with name: ${file?.name || 'unknown'}`)
      }

      return url
    } catch (error: any) {
      // Check if it's a 500 error and we have retries left
      const is500Error = error?.statusCode === 500 || error?.status === 500 || error?.response?.status === 500

      if (is500Error && attempt < retries) {
        // Exponential backoff: wait longer between each retry
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 2000) // Max 2s delay
        console.warn(`Upload failed with 500 error (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`, file.name)

        await new Promise(resolve => setTimeout(resolve, delayMs))

        return upload(file, retries, attempt + 1)
      }

      // If it's not a 500 error or we're out of retries, throw the error
      if (is500Error) {
        console.error(`Upload failed after ${retries} retries:`, file.name)
      }
      throw error
    }
  }

  return { upload }
}
