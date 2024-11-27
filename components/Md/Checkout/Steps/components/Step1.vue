<template>
  <VeeForm :validationSchema="validationSchema" :initialValues @submit="handleSubmit" v-slot="{ isSubmitting }">
    <VRow>
      <VCol cols="12">
        <h2 class="title">Dados Pessoais</h2>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="name" label="Nome" placeholder="Digite o seu nome completo" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="email" label="E-mail" placeholder="Digite o seu e-mail para contato" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeDateField required name="birthday" label="Data de Nascimento" placeholder="Digite a sua data de nascimento" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeMaskedField
            required
            name="phone"
            label="Telefone"
            placeholder="Digite o seu telefone para contato"
            mask="(##) # ####-####"
        />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeSelect required name="hasWhatsapp" label="Possui Whatsapp" :items="['Sim', 'Não']" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeMaskedField
            required
            name="cpf"
            label="CPF"
            placeholder="Digite o seu CPF"
            mask="###.###.###-##"
        />
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0" v-if="!isLogged">
        <VeeTextField required name="password" label="Senha" type="password" />
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0" v-if="!isLogged">
        <VeeTextField required name="repeatPassword" label="Repita sua senha" type="password" />
      </VCol>
      <VCol cols="12">
        <h2 class="title">Endereço</h2>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeMaskedField mask="#####-###" required name="cep" label="Cep" placeholder="Digite o CEP para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="state" label="Estado" placeholder="Digite o estado para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="city" label="Cidade" placeholder="Digite a cidade para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="neighborhood" label="Bairro" placeholder="Digite o bairro para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="street" label="Rua" placeholder="Digite a rua para envio"/>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField type="number" required name="number" label="Número" placeholder="Digite o número para envio"/>
      </VCol>
    </VRow>
    <VeeButton class="next-button" append-icon="mdi-arrow-right" :loading="isSubmitting">
      Próximo
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
import {z} from "zod";
import type {User} from "~/types/user";

const props = defineProps<{ next: Function }>()

const validationSchema = z.object({
  // user information
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  birthday: z.string()
      .min(10, { message: 'Data de nascimento inválida' })
      .refine(validateBirthdateString, { message: 'Data de nascimento inválida' }),
  phone: z.string().min(16, { message: 'Telefone inválido' }),
  hasWhatsapp: z.string().min(1, { message: 'Selecione uma opção' }),
  cpf: z.string().refine(validateCPF, { message: 'CPF inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  repeatPassword: z.string().min(6, { message: 'A senha de repetição deve ter pelo menos 6 caracteres' }),

  // address information
  cep: z.string().min(9, { message: 'CEP inválido' }),
  state: z.string().min(3, { message: 'Estado inválido' }),
  city: z.string().min(3, { message: 'Cidade inválida' }),
  neighborhood: z.string().min(3, { message: 'Bairro inválido' }),
  street: z.string().min(3, { message: 'Rua inválida' }),
  number: z.number({ message: 'Campo obrigatório' }).min(1, { message: 'Número inválido' })
}).refine((fields) =>  fields.password === fields.repeatPassword, {
  message: 'As senhas não coincidem',
  path: ['repeatPassword']
})

const { post } = useApi()
const { ecommerceId } = useStoreData()
const { cartId } = useCart()
const { userData, isLogged, setUser } = useUser()

const initialValues = computed(() => {
  if (!userData.value) return

  return {
    name: userData.value?.name,
    email: userData.value?.email,
    phone: userData.value?.phone,
    cpf: userData.value?.cpf,
    birthday: userData.value?.birthday,
    hasWhatsapp: userData.value?.hasWhatsapp ? 'Sim' : 'Não',
    cep: userData.value?.address?.cep,
    state: userData.value?.address?.state,
    city: userData.value?.address?.city,
    neighborhood: userData.value?.address?.neighborhood,
    street: userData.value?.address?.street,
    number: userData.value?.address?.number
  }
})

const handleSubmit = async (values: Record<string, any>) => {
  console.log(values, 'submit user data')
  try {
    const {
      _id,
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      cpf: defaultCpf,
      birthday: defaultBirthday,
      hasWhatsapp: defaultHasWhatsapp,
      address: {
        cep: defaultCep = '',
        state: defaultState = '',
        city: defaultCity = '',
        neighborhood: defaultNeighborhood = '',
        street: defaultStreet = '',
        number: defaultNumber = ''
      } = {}
    } = userData.value || {}
    const response = await post(`/checkout/user/${ecommerceId}`, {
      userData: {
        _id,
        name: values.name || defaultName,
        email: values.email || defaultEmail,
        phone: values.phone || defaultPhone,
        cpf: values.cpf || defaultCpf,
        birthday: values.birthday || defaultBirthday,
        password: values?.password,
        hasWhatsapp: values.hasWhatsapp === 'Sim' || defaultHasWhatsapp,
        address: {
          cep: values.cep || defaultCep,
          state: values.state || defaultState,
          city: values.city || defaultCity,
          neighborhood: values.neighborhood || defaultNeighborhood,
          street: values.street || defaultStreet,
          number: values.number || defaultNumber
        }
      },
      cartId: cartId.value
    })
    console.log(response, 'response')
    setUser(response as User)
    props.next()
  } catch (e) {
    console.error(e)
    handleError('Erro ao enviar formulário com dados de usuário')
  }
}
</script>

<style lang="scss">

</style>
