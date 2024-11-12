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

    <VForm fast-fail @submit.prevent="submit" aria-autocomplete="off">
      <VeeTextField
          :value="name"
          label="Nome"
          outlined
          required
      />

      <VeeTextField
          :value="email"
          label="E-mail"
          outlined
          required
      />

      <VeeTextField
          :value="password"
          label="Senha"
          outlined
          required
          type="password"
      />

      <VeeTextField
          :value="repeatPassword"
          label="Repetir Senha"
          outlined
          required
          type="password"
      />

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn
              variant="tonal"
              color="primary"
              width="100%"
              type="submit"
              :loading="isLoading"
          >
            Cadastrar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import { useField, useForm } from 'vee-validate'
import {validateEmail, validateName, validatePassword, validatePasswordConfirmation} from "~/utils/Validators";

const { handleSubmit } = useForm({
  validationSchema: {
    name(value: string) {
      return validateName(value)
    },
    email (value: string) {
      return validateEmail(value)
    },
    password: (value: string) => {
      return validatePassword(value)
    },
    repeatPassword: (value: string) => {
      return validatePasswordConfirmation(value, password?.value?.value as string)
    }
  }
})

const isLoading = ref(false)
const showRegisterModal = ref(false)

const name = useField('name')
const email = useField('email')
const password = useField('password')
const repeatPassword = useField('repeatPassword')

const onClose = () => {
  showRegisterModal.value = false
}

const { register } = useUser()

const submit = handleSubmit(async values => {
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
})
</script>
