<template>
  <div class="cart-item">
    <div class="product-image-container">
      <MdProductImage :image="item.image" as-image />
      <VBtn
          icon
          class="remove-btn"
          :disabled="loading"
          @click="removeItem"
      >
        <VIcon>mdi-delete</VIcon>
      </VBtn>
    </div>
    <div class="product-info">
      <VTooltip bottom>
        <template #activator="{ props }">
          <VListItemTitle
              v-bind="props"
              class="product-name"
          >
            {{ item.name }}
          </VListItemTitle>
        </template>
        <span>{{ item.name }}</span>
      </VTooltip>

      <VListItemSubtitle>R${{ item.price }}</VListItemSubtitle>

      <VProgressCircular
          v-if="loading"
          indeterminate
          color="primary"
          size="24"
          class="loading-spinner"
      />

      <div class="quantity">
        <span>Quantidade:</span>
        <div class="quantity-controls">
          <VBtn
              icon
              size="small"
              class="quantity-btn"
              :disabled="loading"
              @click="decreaseQuantity"
          >
            <VIcon>mdi-minus</VIcon>
          </VBtn>
          <span class="quantity-value">{{ item.quantity }}</span>
          <VBtn
              icon
              size="small"
              class="quantity-btn"
              :disabled="loading"
              @click="increaseQuantity"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </div>
      </div>
      <div v-if="item.fields.length" class="product-fields">
        <div v-for="field in item.fields" :key="field.label" class="field">
          <strong>{{ field.label }}:</strong> {{ field.value || 'N/A' }}
        </div>
      </div>
      <MdProductDetailModal :product="item">
        <VBtn
            class="view-details-btn small-btn"
            size="x-small"
            variant="outlined"
        >
          Ver Detalhes
        </VBtn>
      </MdProductDetailModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICartItem } from "~/types/cart"

const props = defineProps<{
  item: ICartItem;
}>()

const { changeQuantity, loading } = useCart()

const removeItem = () => changeQuantity(props.item, 0)

const increaseQuantity = () => changeQuantity(props.item, props.item.quantity + 1)

const decreaseQuantity = () => changeQuantity(props.item, props.item.quantity - 1)
</script>

<style lang="scss" scoped>
.cart-item {
  margin: 16px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;

  .product-image-container {
    position: relative;
    min-width: 130px;
    min-height: 130px;
    margin-right: 16px;

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .remove-btn {
      position: absolute;
      bottom: -20px;
      left: 0;
      margin-top: 8px;

      .v-icon {
        color: var(--danger-color-500);
      }
    }
  }

  .product-info {
    width: 100%;
    flex-grow: 1;
    gap: 16px;
    justify-content: space-between;

    .product-name {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .quantity {
      margin: 8px 0;
      font-size: 0.875rem;
      color: #444;

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 8px;

        .quantity-value {
          font-size: 1rem;
          font-weight: bold;
          text-align: center;
          min-width: 24px;
        }

        .quantity-btn {
          background-color: #f0f0f0;
          border-radius: 50%;
          padding: 4px;
        }
      }
    }

    .product-fields {
      margin-top: 8px;

      .field {
        font-size: 0.875rem;
        color: #555;
      }
    }

    .view-details-btn {
      margin-top: 8px;
      color: var(--primary-color-500);
      border-color: var(--primary-color-500);
      font-size: 0.75rem;
      padding: 2.5px 8px 4px 8px;
    }

    .small-btn {
      border-radius: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}
</style>
