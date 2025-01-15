export const useUpload = () => {
  const { post } = useApi()
  const upload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

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
  }

  return { upload }
}
