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
            <VCol v-for="order in orders" :key="order._id" cols="12" md="6" lg="4">
              <VCard class="order-card" elevation="2">
                <VCardTitle class="order-title">
                  Pedido nº{{ order._id }}
                </VCardTitle>
                <VCardText>
                  <p>Status: {{ formatStatus(order.status) }}</p>
                  <p>Total: R$ {{ calculateTotal(order.items) }}</p>
                  <VList dense>
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
                        <VListItemSubtitle>Quantidade: {{ item.quantity }}</VListItemSubtitle>
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
import type {OrderStatus} from "~/types/order";

const { orders, loading, fetchOrders } = useOrders()
const route = useRoute()
const router = useRouter()
const ecommerceId = route.query.ecommerceId as string

const formatStatus = (status: OrderStatus) => {
  return getOrderLabelStatus(status)
}

const calculateTotal = (items: any[]) =>
    items.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2)

const goToOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

onMounted(() => fetchOrders(ecommerceId))
</script>

<style scoped lang="scss">
.orders-list {
  padding: 16px;

  .order-card {
    border-radius: 8px;
    margin-bottom: 16px;

    .order-title {
      font-weight: bold;
    }
  }

  .product-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
  }

  .no-orders {
    text-align: center;
    color: gray;
    margin-top: 16px;
  }
}
</style>
