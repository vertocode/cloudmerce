<template>
  <div>
    <VBtn icon @click="isDrawerOpen = !isDrawerOpen">
      <VIcon>mdi-cart</VIcon>
    </VBtn>

    <VNavigationDrawer
        v-model="isDrawerOpen"
        app
        temporary
        location="right"
        class="cart-drawer"
    >
      <v-toolbar flat dense>
        <v-toolbar-title>Carrinho de Compras</v-toolbar-title>
      </v-toolbar>

      <div v-if="cartItems.length" class="cart-items-list">
        <div class="list">
          <VList>
            <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
              <div class="product-image-container">
                <img :src="item.image" alt="Product Image" class="product-image" />
              </div>
              <div class="product-info">
                <VListItemTitle>{{ item.name }}</VListItemTitle>
                <VListItemSubtitle>R${{ item.price }}</VListItemSubtitle>
                <VBtn
                    icon
                    class="remove-btn"
                    @click="removeItem(index)"
                >
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </div>
            </div>
          </VList>
        </div>

        <VBtn block color="primary">Comprar</VBtn>
      </div>


      <div v-else class="empty-cart">
        <VIcon class="empty-cart-icon">mdi-cart-off</VIcon>
        <p>Seu carrinho está vazio!</p>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDrawerOpen = ref(false)

interface CartItem {
  name: string
  price: number
  image: string
}

const cartItems = ref<CartItem[]>([
  {
    name: 'Product 1',
    price: 100,
    image: 'https://via.placeholder.com/150',
  }
])

const removeItem = (index: number) => {
  cartItems.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.cart-drawer {
  width: 300px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
  text-align: center;
  color: #757575;

  p {
    margin-top: 10px;
    font-size: 1.2rem;
  }

  .empty-cart-icon {
    font-size: 48px;
    color: #b0bec5;
  }
}

.cart-items-list {
  padding: 16px;

  .list {
    max-height: 80vh;
    overflow-y: auto;
    margin-bottom: 24px;

    .cart-item {
      margin: 16px auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;

      .product-image-container {
        min-width: 100px;
        min-height: 100px;
        margin-right: 16px;
      }

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #ddd;
      }

      .product-info {
        width: 100%;
        flex-grow: 1;
        gap: 16px;
        justify-content: space-between;

        .remove-btn {
          margin-top: 8px;

          .v-icon {
            color: $danger-color-500;
          }
        }
      }
    }
  }
}
</style>
