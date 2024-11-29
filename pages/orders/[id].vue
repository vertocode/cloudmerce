<template>
  <div class="order-details">
    <VCard class="order-card" elevation="3">
      <VCardActions>
        <VBtn color="primary" variant="outlined" @click="goToOrders">
          <VIcon class="mr-1" color="primary">mdi-arrow-left</VIcon>
          Voltar para Pedidos
        </VBtn>
      </VCardActions>

      <VCardTitle class="order-title">Detalhes do Pedido nº{{id}}</VCardTitle>

      <div v-if="loading">
        <div class="loading-container">
          <VProgressCircular indeterminate size="50" color="primary" />
          <span>Carregando detalhes do pedido...</span>
        </div>
      </div>

      <div v-else-if="order">
        <div class="order-status">
          <h3 class="mobile-status">Status do Pedido: <MdOrdersStatusChip :status="order.status"/></h3>
          <VStepper
              hide-actions
              v-model="statusStep"
              class="status-stepper desktop-status"
              elevation="0"
              :items="['Aguardando Pagamento', 'Loja Notificada', 'Pedido Enviado', 'Pedido Entregue']"
          >

          </VStepper>
        </div>

        <VCardText class="content">
          <div class="products">
            <h4>Produtos Comprados</h4>
            <VList dense class="products">
              <VListItem
                  v-for="item in order.items"
                  :key="item.productId._id"
                  class="product-item"
              >
                <img
                    :src="item.productId.image?.[0] || '/placeholder.png'"
                    alt="Imagem do Produto"
                    class="product-image"
                />
                <br>
                <MdProductDetailsSeeButton :productId="item.productId._id" />
                <VListItemContent>
                  <VListItemTitle class="product-name">{{ item.productId.name }}</VListItemTitle>
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

          <div class="calc">
            <MdOrdersDetailsShipping />

            <MdCalcProductSummary :cartProducts="products" :total="totalAmount" />
          </div>
        </VCardText>
      </div>

      <div v-else>
        <p class="error-message">Não foi possível carregar os detalhes do pedido.</p>
      </div>

      <div>
        <h4>
          Tem dúvidas ou precisa de assistência com seu pedido? Estamos à disposição para ajudar. Entre em contato através do formulário abaixo.
        </h4>

        <br>

        <ElContactForm :additional-info="additionalInformationContact"/>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { useOrderById } from '~/composables/useOrderById'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { order, loading } = useOrderById(id)
const { userData } = useUser()

const additionalInformationContact = computed(() => {
  return `orderId: ${id} \n orderDetails: ${JSON.stringify(order.value)}`
})

const products = computed(() => {
  if (!order.value) return []

  return order.value.items.map(item => ({
    quantity: item.quantity,
    ...item.productId
  }))
})

const statusStep = computed(() => (order.value?.status === 'paid' ? 2 : 1))

const totalAmount = computed(() =>
    order.value?.items?.reduce(
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

  .content {
    display: flex;
    justify-content: space-between;
    gap: 24px;

    :deep(.calc) {
      width: 100%;

      .label {
        max-width: 100%;
      }
    }

    @media screen and (max-width: $mobile-breakpoint) {
      justify-content: center;
      flex-wrap: wrap-reverse;
      align-items: center;
    }
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

    .status-stepper {
      margin-top: 16px;
      justify-content: center;
    }

    .mobile-status {
      display: none;
    }

    @media screen and (max-width: 900px) {
      .desktop-status {
        display: none;
      }

      .mobile-status {
        display: block;
      }
    }
  }

  .products {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .product-item {
    width: max-content;
    border: 1px solid rgba(128, 128, 128, 0.31);
    display: flex;
    align-items: center;
    gap: 16px;

    .product-name {
      max-width: 300px;
    }
  }

  .product-image {
    align-self: center;
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
}
</style>
