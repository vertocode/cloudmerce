<template>
  <VeeForm
    :initial-values="initialValues"
    :validation-schema="validationSchema"
    @submit="handleSubmit"
  >
    <VRow>
      <VCol
        cols="12"
        md="4"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="name"
          label="Nome da Loja"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pb-0"
      >
        <VeeTextField
          name="baseUrl"
          label="URL do E-Commerce"
          disabled
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pr-0 pb-0"
      >
        <VeeTextField
          name="logo"
          label="URL da sua logo"
        />
      </VCol>
      <VCol
        cols="12"
        class="pl-0 pb-0"
      >
        <VeeTextarea
          name="description"
          label="Descrição da sua loja"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="bannerTitle"
          label="Título do Banner"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pr-0 pb-0"
      >
        <VeeTextField
          name="bannerDescription"
          label="Mensagem do Banner"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pl-0 pb-0"
      >
        <VeeColorField
          name="primaryColor"
          label="Cor Primária"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pr-0 pb-0"
      >
        <VeeColorField
          name="secondaryColor"
          label="Cor Secundária"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="wpp"
          label="Número do WhatsApp"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pb-0"
      >
        <VeeTextField
          name="wpp"
          label="@ do Instagram"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pr-0 pb-0"
      >
        <VeeTextField
          name="wpp"
          label="Twitter"
          outlined
        />
      </VCol>
      <VCol cols="12">
        <VeeButton
          class="mb-5 w-100"
          variant="elevated"
          color="primary"
        >
          Salvar Configuração
        </VeeButton>
      </VCol>
    </VRow>
  </VeeForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { IWhitelabel } from '~/types/whitelabel'

const initialValues = {
  baseUrl: window?.location?.origin as string,
}

const validationSchema = z.object({
  name: z.string().min(3, { message: 'O nome da loja deve ter pelo menos 3 caracteres' }),
  baseUrl: z
    .string()
    .url({ message: 'URL inválida' }),
  logo: z.string().url({ message: 'URL da logo inválida' }),
  description: z.string().optional(),
  bannerTitle: z.string().min(5, { message: 'O título do banner deve ter pelo menos 5 caracteres' }),
  bannerDescription: z.string().optional(),
  primaryColor: z
    .string()
    .refine(validateColor, { message: 'Insira uma cor hexadecimal válida' }),
  secondaryColor: z
    .string()
    .refine(validateColor, { message: 'Insira uma cor hexadecimal válida' }),
  wpp: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
})

const handleSubmit = async (values: Record<string, any>) => {
  const { post } = useApi()
  const router = useRouter()
  try {
    const response = await post('/whitelabel', {
      baseUrl: values.baseUrl,
      name: values.name,
      description: values.description,
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
      banner: {
        title: values.bannerTitle,
        description: values.bannerDescription,
      },
      logoUrl: values.logo,
      socialMedia: {
        whatsapp: values.wpp,
        instagram: values.instagram,
        twitter: values.twitter,
      },
    })
    if ((response as IWhitelabel)?._id) {
      handleSuccess('Configuração salva com sucesso')
      await router.push('/')
    }
    else {
      throw new Error(`Response without _id: ${response}`)
    }
  }
  catch (e) {
    console.error(e)
    handleError('Erro ao salvar configuração')
  }
}
</script>
