<template>
  <div class="orders-list">
    <VContainer>
      <VRow justify="center">
        <VCol cols="12" md="8">
          <h1>Seus Pedidos</h1>
        </VCol>
      </VRow>
      <VRow justify="center" align="center">
        <div v-if="loading">
          <VProgressCircular indeterminate color="primary" />
          <span>Carregando pedidos...</span>
        </div>
        <VCol cols="12" md="8" v-else>
          <VRow v-if="orders.length" justify="center">
            <VCol v-for="order in orders" :key="order._id" cols="12">
              <VCard class="order-card" elevation="4">
                <VCardTitle class="order-title">
                  Pedido nº {{ order._id }}
                </VCardTitle>
                <VCardText>
                  <p>Status: {{ formatStatus(order.status) }}</p>
                  <p>Total: R$ {{ calculateTotal(order.items) }}</p>
                  <VList dense class="product-list">
                    <VListItem v-for="item in order.items" :key="item.productId._id">
                      <VListItemAvatar>
                        <img
                            :src="item.productId.image?.[0] || '/placeholder.png'"
                            alt="Imagem do produto"
                            class="product-image"
                        />
                      </VListItemAvatar>
                      <VListItemContent>
                        <VListItemTitle>{{ item.productId.name }}</VListItemTitle>
                        <VListItemSubtitle>Qtd: {{ item.quantity }}</VListItemSubtitle>
                      </VListItemContent>
                      <VListItemIcon>
                        <span>R$ {{ (item.productId.price * item.quantity).toFixed(2) }}</span>
                      </VListItemIcon>
                    </VListItem>
                  </VList>
                </VCardText>
                <VCardActions>
                  <VBtn color="primary" variant="text" @click="goToOrderDetails(order._id)">
                    Ver Detalhes
                  </VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>
          <p v-else class="no-orders">Você ainda não possui pedidos.</p>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import type { OrderStatus } from "~/types/order"

const { orders, loading, fetchOrders } = useOrders()
const router = useRouter()

const formatStatus = (status: OrderStatus) => {
  return getOrderLabelStatus(status)
}

const calculateTotal = (items: any[]) =>
    items.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2)

const goToOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

onMounted(() => fetchOrders())
</script>

<style scoped lang="scss">
.orders-list {
  .order-card {
    border-radius: 10px;
    margin-bottom: 16px;
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 16px;

    .order-title {
      font-weight: bold;
      font-size: 1.2em;
    }

    .product-list {
      display: flex;
    }
  }

  .product-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .no-orders {
    text-align: center;
    color: gray;
    margin-top: 16px;
  }

  .v-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;

    .v-list-item-avatar {
      margin-right: 12px;
    }

    .v-list-item-content {
      flex-grow: 1;
    }

    .v-list-item-icon {
      font-size: 1rem;
      margin-left: 8px;
    }
  }

  .v-list-item-title {
    max-width: 100px;
    font-size: 1em;
    font-weight: 500;
  }

  .v-list-item-subtitle {
    font-size: 0.85em;
    color: #666;
  }

  .v-card-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
