<template>
  <input
    type="file"
    @change="submit"
  >
</template>

<script setup lang="ts">
const { post } = useApi()

const submit = async (event: Event) => {
  event.preventDefault()
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('message', 'This is a test')
  formData.append('image', file)

  await post('/upload-image', formData, { useFormData: true })
}
</script>
