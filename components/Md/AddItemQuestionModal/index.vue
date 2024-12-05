<template>
  <ElModal
    :is-opened="!!product"
    persistent
    :card-props="{ title: `Adicionar produto ao carrinho`, prependIcon: 'mdi-cart' }"
    max-width="600"
    @close="$emit('close')"
  >
    <div class="add-item-question-modal">
      <p class="modal-question">
        {{ question }}
      </p>

      <VRow
        v-if="product?.fields?.length"
        dense
      >
        <VCol
          v-for="field in product.fields"
          :key="field.label"
          cols="12"
          :md="product.fields.length > 1 ? 6 : 12"
          class="field-col"
        >
          <ElDynamicField
            required
            :field="field"
            :initial-value="field.options?.[0] || ''"
            @update="value => values[field.label] = value"
          />
        </VCol>
      </VRow>
    </div>

    <VRow
      align="center"
      justify="space-between"
    >
      <VCol
        cols="6"
        md="6"
      >
        <v-btn
          class="w-100 close-btn"
          @click="$emit('close')"
        >
          Fechar
        </v-btn>
      </VCol>
      <VCol
        cols="6"
        md="6"
      >
        <v-btn
          class="w-100 confirm-btn"
          color="primary"
          :loading="loading"
          @click="handleConfirm"
        >
          Confirmar
        </v-btn>
      </VCol>
    </VRow>
  </ElModal>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product'

const { addToCart, loading } = useCart()

const props = defineProps<{
  product: IProduct | null
  onConfirm?: (fields: Record<string, string>) => void
}>()

const emit = defineEmits()

const values = ref<Record<string, string>>(props.product?.fields.reduce((acc, field) => {
  acc[field.label] = ''

  if (field.options?.length) acc[field.label] = field.options[0]

  return acc
}, {} as Record<string, string>) || {})

const question = computed(() => {
  const { product } = props
  if (!product) return ''

  if (product.fields.length === 1) return `Para adicionar o produto ${product.name} ao carrinho, você precisa preencher o campo abaixo.`

  return `Para adicionar o produto ${product.name} ao carrinho, você precisa preencher os campos abaixo.`
})

const handleConfirm = async () => {
  if (!props.product) return

  const isMissingFields = Object.values(values.value).some(value => !value)
  if (isMissingFields) {
    const label = Object.keys(values.value).find(key => !values.value[key])
    handleWarning(`O campo ${label} é obrigatório, por favor preencha-o.`)
    return
  }

  const { product } = props

  const fields = product?.fields?.map((field) => {
    const value = (() => {
      if (field.type === 'options' && field.options?.length) {
        return field.options.at(0)
      }

      return values.value[field.label]
    })()

    return { ...field, value }
  }) || []

  const { code } = await addToCart({ ...product, fields, quantity: 1 })

  if (code === 'success') {
    emit('close')
  }
}
</script>

<style scoped>
.add-item-question-modal {
  padding: 16px;
}

.modal-question {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.close-btn {
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  text-transform: none;
  font-weight: 500;
}

.confirm-btn {
  background-color: #1976d2;
  color: #fff;
  border-radius: 4px;
  text-transform: none;
  font-weight: 600;
}
</style>
