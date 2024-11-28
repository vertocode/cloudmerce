<template>
  <div class="order-details">
    <VCard class="order-card" elevation="3">
      <VCardTitle class="order-title">Detalhes do Pedido</VCardTitle>

      <div v-if="loading">
        <div class="loading-container">
          <VProgressCircular indeterminate size="50" color="primary" />
          <span>Carregando detalhes do pedido...</span>
        </div>
      </div>

      <div v-else-if="order">
        <div class="order-status">
          <h3>Status do Pedido</h3>
          <VStepper
              v-model="statusStep"
              class="status-stepper"
              elevation="0"
              :items="['Aguardando Pagamento', 'Pagamento Confirmado', 'Loja Notificada', 'Pedido Enviado', 'Pedido Entregue']"
          >

          </VStepper>
        </div>

        <VCardText>
          <div class="products">
            <h3>Produtos Comprados</h3>
            <VList dense>
              <VListItem
                  v-for="item in order.items"
                  :key="item.productId._id"
                  class="product-item"
              >
                <VListItemAvatar>
                  <img
                      :src="item.productId.image?.[0] || '/placeholder.png'"
                      alt="Imagem do Produto"
                      class="product-image"
                  />
                </VListItemAvatar>
                <VListItemContent>
                  <VListItemTitle>{{ item.productId.name }}</VListItemTitle>
                  <VListItemSubtitle>
                    Quantidade: {{ item.quantity }}
                  </VListItemSubtitle>
                </VListItemContent>
                <VListItemIcon>
                  <span>R$ {{ (item.productId.price * item.quantity).toFixed(2) }}</span>
                </VListItemIcon>
              </VListItem>
            </VList>
          </div>

          <div class="total">
            <h3>Total: R$ {{ totalAmount }}</h3>
          </div>
        </VCardText>
      </div>

      <div v-else>
        <p class="error-message">Não foi possível carregar os detalhes do pedido.</p>
      </div>

      <VCardActions>
        <VBtn color="primary" block @click="goToOrders">Voltar para Pedidos</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { useOrderById } from '~/composables/useOrderById'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { order, loading } = useOrderById(id)

// Define o step atual do status
const statusStep = computed(() => (order?.status === 'paid' ? 2 : 1))

// Calcula o valor total da ordem
const totalAmount = computed(() =>
    order?.items?.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
    ).toFixed(2) || '0.00'
)

const goToOrders = () => {
  router.push('/orders')
}
</script>

<style scoped lang="scss">
.order-details {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.order-card {
  max-width: 1200px;
  width: 100%;
  padding: 24px;
}

.order-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 32px 0;
}

.order-status {
  margin-bottom: 24px;
  text-align: center;
}

.status-stepper {
  margin-top: 16px;
  justify-content: center;
}

.products {
  margin: 16px 0;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.total {
  margin-top: 16px;
  font-size: 1.4rem;
  font-weight: bold;
  text-align: right;
}

.error-message {
  color: red;
  text-align: center;
  font-weight: bold;
  margin: 24px 0;
}
</style>
