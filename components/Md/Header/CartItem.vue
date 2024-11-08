<template>
  <div class="cart-item">
    <div class="product-image-container">
      <MdProductImage :product="item" as-image />
      <VBtn
          icon
          class="remove-btn"
          @click="removeItem"
      >
        <VIcon>mdi-delete</VIcon>
      </VBtn>
    </div>
    <div class="product-info">
      <VListItemTitle>{{ item.name }}</VListItemTitle>
      <VListItemSubtitle>R${{ item.price }}</VListItemSubtitle>
      <div class="quantity">
        <span>Quantidade:</span>
        <div class="quantity-controls">
          <VBtn
              icon
              size="small"
              class="quantity-btn"
              @click="decreaseQuantity"
          >
            <VIcon>mdi-minus</VIcon>
          </VBtn>
          <span class="quantity-value">{{ item.quantity }}</span>
          <VBtn
              icon
              size="small"
              class="quantity-btn"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICartItem } from "~/types/cart";

const removeItem = () => {
  // Função para remover o item
};

const increaseQuantity = () => {
  // Lógica para aumentar a quantidade
};

const decreaseQuantity = () => {
  // Lógica para diminuir a quantidade
};

defineProps<{
  item: ICartItem;
}>();
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
  }
}
</style>
