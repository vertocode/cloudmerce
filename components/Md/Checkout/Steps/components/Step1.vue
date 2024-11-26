<template>
  <VeeForm :validationSchema="validationSchema" @submit="() => next()">
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
    <VeeButton class="next-button" append-icon="mdi-arrow-right">
      Próximo
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
import {z} from "zod";

defineProps<{ next: Function }>()

const validationSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  birthday: z.string()
      .min(10, { message: 'Data de nascimento inválida' })
      .refine(validateBirthdateString, { message: 'Data de nascimento inválida' }),
  phone: z.string().min(16, { message: 'Telefone inválido' }),
  hasWhatsapp: z.string().min(1, { message: 'Selecione uma opção' }),
  cpf: z.string().refine(validateCPF, { message: 'CPF inválido' }),
  cep: z.string().min(9, { message: 'CEP inválido' }),
  state: z.string().min(3, { message: 'Estado inválido' }),
  city: z.string().min(3, { message: 'Cidade inválida' }),
  neighborhood: z.string().min(3, { message: 'Bairro inválido' }),
  street: z.string().min(3, { message: 'Rua inválida' }),
  number: z.number({ message: 'Campo obrigatório' }).min(1, { message: 'Número inválido' })
})
</script>

<style lang="scss">

</style>
