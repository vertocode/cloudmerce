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
const submit = async (values: { profile_picture: File }) => {
  const file = values.profile_picture
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  const { post } = useApi()

  await post('/upload-image', formData, { useFormData: true })
}
</script>
