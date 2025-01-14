<template>
  <VeeForm
    :validation-schema="validationSchema"
    @submit="handleSubmit"
  >
    <section class="rows">
      <h3>Dados do Cartão</h3>
      <div class="row-1">
        <VeeTextField
          name="cardHolderName"
          label="Títular do Cartão"
          placeholder="Digite o nome do títular do cartão"
        />

        <VeeMaskedField
          name="cardCpf"
          label="CPF do Títular do Cartão"
          placeholder="Digite o CPF do títular do cartão"
          mask="###.###.###-##"
        />
      </div>

      <div class="row-2">
        <VeeMaskedField
          name="cardNumber"
          label="Número do Cartão"
          append-inner-icon="mdi-credit-card-outline"
          placeholder="Digite o número do cartão"
          :mask="cardMask"
          @input="onCardNumberInput"
        />

        <VeeMaskedField
          name="cardExpiryDate"
          mask="##/####"
          placeholder="MM/AAAA"
          label="Data de Expiração"
        />

        <VeeTextField
          name="cardCvv"
          label="CVV / CVC"
          append-inner-icon="mdi-lock-outline"
          placeholder="Digite o código de segurança"
        />
      </div>
    </section>

    <div class="action-buttons">
      <VBtn
        class="back-button"
        prepend-icon="mdi-arrow-left"
        @click="prev"
      >
        Voltar
      </VBtn>
      <VeeButton
        class="next-button"
        color="primary"
        :loading="loadingSubmit"
      >
        <span class="mr-2">
          Processar Pagamento
        </span>
        <VIcon color="#fff">
          mdi-credit-card-outline
        </VIcon>
      </VeeButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import cardValidator from 'card-validator'
import { type CreditCardData, PaymentMethods } from '~/types/cart'

defineProps<{ prev: () => void }>()

const { submit, loadingSubmit } = useCart()

const defaultMask = '#### #### #### ####'
const cardMask = ref(defaultMask)

const onCardNumberInput = (event: InputEvent) => {
  const input = (event.target as HTMLInputElement).value.replace(/\s/g, '')

  const validation = cardValidator.number(input)
  if (validation.card) {
    switch (validation.card.type) {
      case 'american-express':
        cardMask.value = '#### ###### #####' // American Express
        break
      case 'diners-club':
        cardMask.value = '#### ###### ####' // Diners Club
        break
      default:
        cardMask.value = defaultMask
        break
    }
  }
  else {
    cardMask.value = defaultMask
  }
}

const validateCardNumber = (number: string) => {
  const validation = cardValidator.number(number)
  return validation.isValid
}

const validateExpiryDate = (expiry: string) => {
  const validation = cardValidator.expirationDate(expiry)
  return validation.isValid
}

const validateCvv = (cvv: string, cardNumber: string) => {
  const cardType = cardValidator.number(cardNumber)?.card?.code?.size || 3
  const validation = cardValidator.cvv(cvv, cardType)
  return validation.isValid
}

const validationSchema = z.object({
  cardHolderName: z.string()
    .min(1, 'O nome do títular do cartão é obrigatório'),
  cardCpf: z.string()
    .min(1, 'O CPF do títular do cartão é obrigatório')
    .refine(validateCPF, { message: 'CPF do títular inválido' }),
  cardNumber: z.string()
    .min(1, 'O número do cartão é obrigatório')
    .refine(validateCardNumber, { message: 'Número do cartão inválido' }),
  cardExpiryDate: z.string()
    .min(1, 'A data de expiração do cartão é obrigatória')
    .refine(validateExpiryDate, { message: 'Data de expiração inválida' }),
  cardCvv: z.string()
    .min(1, 'O Código de Segurança do cartão é obrigatório'),
}).refine((data) => {
  const { cardNumber, cardCvv } = data
  return validateCvv(cardCvv, cardNumber)
}, { message: 'Código de Segurança inválido', path: ['cardCvv'] })

const handleSubmit = async (values: CreditCardData) => {
  await submit({
    paymentMethod: PaymentMethods.CreditCard,
    creditCardData: values,
  })
}
</script>

<style lang="scss">
.rows {
  margin-top: 16px;

  .row-1, .row-2 {
    margin-top: 12px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .row-1 {
    grid-template-columns: repeat(2, 1fr);
  }

  .row-2 {
    grid-template-columns: 1fr .5fr .48fr;
  }

  @media screen and (max-width: 1150px) {
    .row-2 {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 768px) {
    .row-1, .row-2 {
      grid-template-columns: 1fr;
    }
  }
}
</style>
