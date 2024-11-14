<template>
  <Modal
      :is-opened="showRegisterModal"
      persistent
      @close="onClose"
      :card-props="{
        prependIcon: 'mdi-account-plus',
        title: 'Cadastro'
      }"
  >
    <template #trigger>
      <div @click="showRegisterModal = true">
        <slot />
      </div>
    </template>

    <VeeForm :validationSchema="validationSchema" @submit="submit" v-slot="{ isSubmitting }">
      <VeeTextField
          name="name"
          label="Nome"
          outlined
          required
      />

      <VeeTextField
          name="email"
          label="E-mail"
          outlined
          required
      />

      <VeeTextField
          name="password"
          label="Senha"
          outlined
          required
          type="password"
      />

      <VeeTextField
          name="repeatPassword"
          label="Repetir Senha"
          outlined
          required
          type="password"
      />

      <VSpacer />

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VeeButton
              variant="tonal"
              color="primary"
              width="100%"
              :loading="isSubmitting"
          >
            Cadastrar
          </VeeButton>
        </VCol>
      </VRow>
    </VeeForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import { ref } from 'vue'
import { z } from 'zod'
import { useUser } from '~/composables/useUser'

const showRegisterModal = ref(false)
const isLoading = ref(false)

const onClose = () => {
  showRegisterModal.value = false
}

const { register } = useUser()

const validationSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  repeatPassword: z.string().min(6, { message: 'A senha de repetição deve ter pelo menos 6 caracteres' })
      .refine(val => val === formData.value.password, { message: 'As senhas não coincidem' })
})

const submit = async (values: Record<string, any>) => {
  isLoading.value = true
  const { code } = await register({
    name: values.name,
    email: values.email,
    password: values.password
  })
  if (code === 'success') {
    showRegisterModal.value = false
  }
  isLoading.value = false
}
</script>
