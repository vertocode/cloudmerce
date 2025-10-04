<template>
  <div>
    <VBtn
      icon
      class="header-icon-btn"
      @click="isCartDrawerOpened = !isCartDrawerOpened"
    >
      <VIcon size="20">mdi-shopping-outline</VIcon>
    </VBtn>

    <Teleport to="body">
      <VNavigationDrawer
        v-if="isLoaded"
        v-model="isCartDrawerOpened"
        temporary
        width="320"
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { cartProducts, getCart, isCartDrawerOpened, loading, total } = useCart()

const isLoaded = ref(false)

onMounted(() => {
  if (!cartProducts.value.length) {
    getCart()
  }
  isLoaded.value = true
})
</script>

<style lang="scss" scoped>
.header-icon-btn {
  color: #1d1d1f !important;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04) !important;
  }
}

:deep(.v-navigation-drawer) {
  position: fixed !important;
  top: 0 !important;
  bottom: 0 !important;
  height: 100vh !important;
  z-index: 2000 !important;
}

:deep(.v-overlay) {
  z-index: 1999 !important;
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
