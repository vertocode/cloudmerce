<template>
  <div class="product-detail-page">
    <header class="product-header">
      <VBtn
        prepend-icon="mdi-arrow-left"
        variant="outlined"
        @click="$router.back()"
      >
        Voltar
      </VBtn>
    </header>

    <div class="product-main">
      <div class="image-section">
        <ProductImages :images="displayImages" />
      </div>

      <div class="details-section">
        <h1 class="product-name">
          {{ product.name }}
        </h1>
        <p class="product-id">
          #{{ product.id }}
        </p>
        <p class="product-price">
          {{ formatCurrency(product.price) }}
        </p>
        <p class="product-description">
          {{ product.description }}
        </p>

        <div
          v-if="product.fields.length"
          class="product-variants"
        >
          <div
            v-for="(field, index) in product.fields"
            :key="index"
            class="variant-group"
          >
            <label class="variant-label">
              {{ field.label }}
              <span v-if="field.type === 'options' && isColorVariant(field.label) && selectedVariants[field.label]" class="selected-value">
                : {{ getOptionName(selectedVariants[field.label]) }}
              </span>
            </label>

            <!-- Color Swatch (for Cor/Color variants) -->
            <div
              v-if="field.type === 'options' && isColorVariant(field.label)"
              class="color-swatches"
            >
              <button
                v-for="(option, optIdx) in field.options"
                :key="optIdx"
                type="button"
                class="color-swatch"
                :class="{ active: isOptionSelected(field.label, option), 'has-image': getOptionImage(option) }"
                :style="{ backgroundColor: getOptionHex(option) }"
                :title="getOptionName(option)"
                @click="selectedVariants[field.label] = option"
              >
                <VIcon
                  v-if="isOptionSelected(field.label, option)"
                  size="16"
                  color="white"
                >
                  mdi-check
                </VIcon>
                <VIcon
                  v-if="getOptionImage(option) && !isOptionSelected(field.label, option)"
                  size="12"
                  class="image-indicator"
                  color="#616161"
                >
                  mdi-image
                </VIcon>
              </button>
            </div>

            <!-- Options variant (dropdown for non-color) -->
            <VSelect
              v-else-if="field.type === 'options'"
              v-model="selectedVariants[field.label]"
              :items="field.options || []"
              :item-title="(item) => getOptionName(item)"
              :item-value="(item) => item"
              variant="outlined"
              density="comfortable"
              :placeholder="`Selecione ${field.label}`"
            >
              <template #item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps">
                  <template #prepend>
                    <VAvatar
                      v-if="getOptionImage(item.raw)"
                      size="32"
                      rounded="0"
                    >
                      <VImg :src="getOptionImage(item.raw)" />
                    </VAvatar>
                  </template>
                </VListItem>
              </template>
              <template #selection="{ item }">
                <div class="d-flex align-center ga-2">
                  <VAvatar
                    v-if="getOptionImage(item.raw)"
                    size="24"
                    rounded="0"
                  >
                    <VImg :src="getOptionImage(item.raw)" />
                  </VAvatar>
                  <span>{{ getOptionName(item.raw) }}</span>
                </div>
              </template>
            </VSelect>

            <!-- Text variant (input) -->
            <VTextField
              v-else-if="field.type === 'text'"
              v-model="selectedVariants[field.label]"
              variant="outlined"
              density="comfortable"
              :placeholder="`Digite ${field.label}`"
            />

            <!-- Number variant (number input) -->
            <VTextField
              v-else-if="field.type === 'number'"
              v-model="selectedVariants[field.label]"
              type="number"
              variant="outlined"
              density="comfortable"
              :placeholder="`Digite ${field.label}`"
            />
          </div>
        </div>

        <div class="action-buttons">
          <VBtn
            class="w-full"
            :loading="loading"
            :disabled="!areAllVariantsSelected"
            color="primary"
            block
            @click="addToCart"
          >
            <VIcon
              class="mr-1"
              color="#fff"
            >
              mdi-cart
            </VIcon>
            Adicionar ao Carrinho
          </VBtn>
          <p
            v-if="!areAllVariantsSelected && product.fields.length"
            class="variant-error"
          >
            Por favor, selecione todas as variantes
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductImages from './ProductImages/index.vue'
import type { IProduct } from '~/types/product'

const props = defineProps<{ product: IProduct }>()

const { addToCart: handleAddToCart, loading } = useCart()

// Initialize selected variants with first option as default
const selectedVariants = ref<Record<string, any>>({})

// Computed property for images to display (product images + selected variant images)
const displayImages = computed(() => {
  const productImages = Array.isArray(props.product.image)
    ? props.product.image
    : [props.product.image]

  // Collect all variant option images
  const allVariantImages: string[] = []
  props.product.fields.forEach(field => {
    if (field.type === 'options' && field.options && Array.isArray(field.options)) {
      field.options.forEach((opt: any) => {
        if (opt && typeof opt === 'object' && opt.image) {
          allVariantImages.push(opt.image)
        }
      })
    }
  })

  // Get selected variant images
  const selectedVariantImages: string[] = []
  Object.values(selectedVariants.value).forEach(variant => {
    if (variant && typeof variant === 'object' && variant.image) {
      selectedVariantImages.push(variant.image)
    }
  })

  // Prioritize: selected variant images first, then product images, then other variant images
  const uniqueImages = new Set([
    ...selectedVariantImages,
    ...productImages.filter(img => img),
    ...allVariantImages,
  ])

  return Array.from(uniqueImages)
})

// Initialize default values when product loads
onMounted(() => {
  props.product.fields.forEach(field => {
    if (field.type === 'options' && field.options && field.options.length > 0) {
      // Normalize options - convert old string format to object format
      const normalizedOptions = field.options.map((opt: any) => {
        if (typeof opt === 'string') {
          return { name: opt, hex: '', image: undefined }
        }
        return opt
      })

      // Use existing value if available, otherwise default to first option
      selectedVariants.value[field.label] = field.value || normalizedOptions[0]
    } else if (field.value) {
      // For text/number types, use the existing value
      selectedVariants.value[field.label] = field.value
    }
  })
})

// Helper functions to handle option format (can be string or object)
const getOptionName = (option: any): string => {
  if (!option) return ''
  return typeof option === 'string' ? option : option.name || ''
}

const getOptionHex = (option: any): string => {
  if (!option) return '#000000'
  return typeof option === 'string' ? option : (option.hex ? `#${option.hex}` : '#000000')
}

const getOptionImage = (option: any): string | undefined => {
  if (!option) return undefined
  return typeof option === 'object' && option.image ? option.image : undefined
}

const isOptionSelected = (fieldLabel: string, option: any): boolean => {
  const selected = selectedVariants.value[fieldLabel]
  if (!selected) return false

  // Compare by name if objects, or direct comparison if strings
  const selectedName = getOptionName(selected)
  const optionName = getOptionName(option)
  return selectedName === optionName
}

// Check if variant is a color variant
const isColorVariant = (label: string) => {
  const lowerLabel = label.toLowerCase()
  return lowerLabel === 'cor' || lowerLabel === 'color' || lowerLabel === 'cores' || lowerLabel === 'colors'
}

// Check if all required variants are selected
const areAllVariantsSelected = computed(() => {
  if (props.product.fields.length === 0) return true

  return props.product.fields.every(field => {
    const value = selectedVariants.value[field.label]
    return value !== undefined && value !== null && value !== ''
  })
})

const addToCart = async () => {
  if (!areAllVariantsSelected.value) {
    return
  }

  // Map selected variants to the format expected by the cart
  const fields = props.product.fields.map(field => ({
    label: field.label,
    type: field.type,
    value: selectedVariants.value[field.label],
  }))

  await handleAddToCart({
    ...props.product,
    status: 'active',
    quantity: 1,
    fields,
  })
}
</script>

<style scoped lang="scss">
.product-detail-page {
  display: flex;
  flex-direction: column;
  padding: 16px;

  .product-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .product-main {
    display: flex;
    gap: 24px;
    align-items: center;

    .image-section {
      width: 100%;
      max-width: 700px;
      align-self: baseline;

      :deep(.product-image-carousel) {
        width: 100%;
      }
    }

    @media (max-width: $mobile-breakpoint) {
      flex-wrap: wrap;

      .image-section {
        max-width: 100%;
      }
    }

    .details-section {
      height: max-content;
      display: flex;
      flex-direction: column;
      width: 100%;

      .product-name {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0;
        padding-bottom: 0;
        color: #333;
      }

      .product-id {
        font-size: .9rem;
        margin-bottom: 8px;
        color: gray;
      }

      .product-price {
        font-size: 1.25rem;
        font-weight: bold;
        color: #27ae60;
        margin-bottom: 16px;
      }

      .product-description {
        font-size: 1rem;
        color: #616161;
        line-height: 1.5;
        margin-bottom: 16px;
      }

      .product-variants {
        margin-bottom: 24px;

        .variant-group {
          margin-bottom: 16px;

          .variant-label {
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            color: #424242;
            margin-bottom: 8px;

            .selected-value {
              font-weight: 400;
              color: #616161;
            }
          }

          .color-swatches {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;

            .color-swatch {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 2px solid #e0e0e0;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;

              &:hover {
                transform: scale(1.1);
                border-color: #9e9e9e;
              }

              &.active {
                border-color: #424242;
                border-width: 3px;
                box-shadow: 0 0 0 2px rgba(66, 66, 66, 0.2);
              }

              .v-icon {
                filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
              }

              .image-indicator {
                position: absolute;
                bottom: -4px;
                right: -4px;
                background-color: rgba(255, 255, 255, 0.95);
                border: 1px solid #e0e0e0;
                border-radius: 50%;
                padding: 2px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
              }
            }
          }
        }
      }

      .action-buttons {
        .variant-error {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 8px;
          text-align: center;
        }
      }

      .action-buttons {
        margin-top: auto;
        max-width: 400px;

        @media (max-width: $mobile-breakpoint) {
          max-width: 100%;
        }

        .v-btn {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: bold;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
