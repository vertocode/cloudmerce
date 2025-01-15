export const useUpload = () => {
  const { post } = useApi()
  const upload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await post('/upload-image', formData, { useFormData: true }) as {
      data: {
        link: string
      }
    }

    if (!response?.data?.link) {
      throw new Error(`Error to upload the image with name: ${file?.name || 'unknown'}`)
    }

    return response.data.link
  }

  return { upload }
}
