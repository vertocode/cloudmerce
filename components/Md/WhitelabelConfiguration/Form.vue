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
          label="Host do E-Commerce"
          disabled
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pr-0 pb-0"
      >
        <VeeTextField
          name="logoUrl"
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
        <VeeMaskedField
          mask="## #####-####"
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
          name="instagram"
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
          name="twitter"
          label="Twitter"
          outlined
        />
      </VCol>
      <VCol cols="12">
        <h3 class="mb-2">
          Dados para receber pagamento
        </h3>
      </VCol>
      <VCol cols="12">
        <p class="mb-5">
          Para habilitar o recebimento automático de pagamentos, insira o seu Access Token do Mercado Pago. Caso prefira, você pode deixar este campo em branco e configurá-lo posteriormente. Atenção: se o token não for informado e um pedido for pago, o valor será creditado na conta da Cloudmerce.
        </p>
      </VCol>
      <VCol
        cols="12"
      >
        <VeeTextField
          name="mercadopagoId"
          type="password"
          label="Access Token do Mercado Pago"
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

const url = useRequestURL()

const { getWhitelabelWPaymentData } = useWhitelabel()

const whitelabel = await getWhitelabelWPaymentData()

const initialValues = {
  baseUrl: url.host as unknown as string,
  bannerTitle: whitelabel?.banner?.title || '',
  bannerDescription: whitelabel?.banner?.description || '',
  wpp: whitelabel?.socialMedia?.wpp || '',
  instagram: whitelabel?.socialMedia?.instagram || '',
  twitter: whitelabel?.socialMedia?.twitter || '',
  mercadopagoId: whitelabel?.paymentData?.mercadopagoId || '',
  ...(whitelabel as Omit<IWhitelabel, 'baseUrl'> || {}),
}

const validationSchema = z.object({
  name: z.string().min(3, { message: 'O nome da loja deve ter pelo menos 3 caracteres' }),
  baseUrl: z
    .string(),
  logoUrl: z.string().url({ message: 'URL da logo inválida' }),
  description: z.string().optional(),
  bannerTitle: z.string().min(5, { message: 'O título do banner deve ter pelo menos 5 caracteres' }).max(40, 'Título do banner deve ter no máximo 50 caracteres'),
  bannerDescription: z.string().min(5, { message: 'A descrição do banner deve ter pelo menos 5 caracteres' }).max(150, 'Descrição do banner deve ter no máximo 150 caracteres'),
  primaryColor: z
    .string()
    .refine(validateColor, { message: 'Insira uma cor hexadecimal válida' }),
  secondaryColor: z
    .string()
    .refine(validateColor, { message: 'Insira uma cor hexadecimal válida' }),
  wpp: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  mercadopagoId: z.string().optional(),
})

const handleSubmit = async (values: Record<string, any>) => {
  const { post, put } = useApi()
  const router = useRouter()
  const id = whitelabel?._id
  try {
    const whitelabelData = {
      baseUrl: values.baseUrl,
      name: values.name,
      description: values.description,
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
      banner: {
        title: values.bannerTitle,
        description: values.bannerDescription,
      },
      logoUrl: values.logoUrl,
      socialMedia: {
        wpp: values.wpp,
        instagram: values.instagram,
        twitter: values.twitter,
      },
      paymentData: {
        mercadopagoId: values.mercadopagoId,
      },
    }
    if (id) {
      const response = await put(`/whitelabel/${id}`, whitelabelData)

      if ((response as { code: number })?.code === 200) {
        handleSuccess('Configuração salva com sucesso')
        await router.push('/')
        window.location.reload()
      }
      else {
        throw new Error(`Response without code 200: ${response}`)
      }
    }
    else {
      const response = await post('/whitelabel', whitelabelData)

      if ((response as IWhitelabel)?._id) {
        handleSuccess('Configuração salva com sucesso')
        window.open('/', '_self')
      }
      else {
        throw new Error(`Response without _id: ${response}`)
      }
    }
  }
  catch (e) {
    console.error(e)
    handleError('Erro ao salvar configuração')
  }
}
</script>
