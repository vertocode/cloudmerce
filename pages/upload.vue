<template>
  <VeeForm @submit="submit">
    <VeeFile
      name="profile_picture"
      label="Selecione sua foto de perfil"
      accept="image/*"
      :show-size="true"
      :multiple="false"
    />

    <VeeButton>
      Upload
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
const { post } = useApi()

const submit = async (values) => {
  const file = values.profile_picture
  console.log(file, 'file')
  if (!file) return

  const formData = new FormData()
  formData.append('message', 'This is a test')
  formData.append('image', file)

  await post('/upload-image', formData, { useFormData: true })
}
</script>
