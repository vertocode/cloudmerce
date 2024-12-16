<template>
  <div>
    <VBtn
      icon
      @click="isCartDrawerOpened = !isCartDrawerOpened"
    >
      <VIcon>mdi-cart</VIcon>
    </VBtn>

    <VNavigationDrawer
      v-if="isLoaded"
      v-model="isCartDrawerOpened"
      app
      temporary
      width="320"
      height="100%"
      location="right"
      class="cart-drawer"
    >
      <v-toolbar
        flat
        dense
      >
        <div class="title">
          <v-toolbar-title class="flex justify-space-between">
            Carrinho de Compras
          </v-toolbar-title>
          <VIcon @click="isCartDrawerOpened = false">
            mdi-close
          </VIcon>
        </div>
      </v-toolbar>

      <div
        v-if="loading"
        class="loading"
      >
        <VProgressLinear
          indeterminate
          color="primary"
        />
      </div>

      <div
        v-else-if="cartProducts.length"
        class="cart-items-list"
      >
        <div class="list">
          <VList>
            <MdCartItem
              v-for="(item, key) in cartProducts"
              :key
              :item
            />
          </VList>
        </div>

        <div>
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-value">R${{ total }}</span>
          </div>

          <VBtn
            block
            color="primary"
            @click="$router.push('/checkout')"
          >
            Comprar
          </VBtn>
        </div>
      </div>

      <div
        v-else
        class="empty-cart"
      >
        <VIcon class="empty-cart-icon">
          mdi-cart-off
        </VIcon>
        <p>Seu carrinho está vazio!</p>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
  getCart()
})

const { cartProducts, getCart, isCartDrawerOpened, loading, total } = useCart()
</script>

<style lang="scss" scoped>
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

.title {
  margin: 0 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-items-list {
  padding: 16px;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .list {
    border-bottom: 1px solid #e0e0e0;
    max-height: 75vh;
    overflow-y: auto;

    .cart-item:not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }
  }
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  font-weight: bold;
  font-size: 1.2rem;
  color: #212121;

  .cart-total-value {
    color: var(--primary-color);
  }
}
</style>
