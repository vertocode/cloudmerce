<template>
  <div class="order-details">
    <VCard
      class="order-card"
      elevation="3"
    >
      <VCardActions class="actions">
        <VBtn
          color="primary"
          variant="outlined"
          @click="goBackOrHome"
        >
          <VIcon
            class="mr-1"
            color="primary"
          >
            mdi-arrow-left
          </VIcon>
          Voltar para Pedidos
        </VBtn>
        <VBtn
          color="primary"
          variant="outlined"
          icon
          :disabled="loading || !order || order.status === 'finished'"
          @click="fetchOrder"
        >
          <VIcon color="primary">
            mdi-refresh
          </VIcon>
        </VBtn>
      </VCardActions>

      <VCardTitle class="order-title">
        Detalhes do Pedido nº{{ id }}
      </VCardTitle>

      <div v-if="loading">
        <div class="loading-container">
          <VProgressCircular
            indeterminate
            size="50"
            color="primary"
          />
          <span>Carregando detalhes do pedido...</span>
        </div>
      </div>

      <div v-else-if="order">
        <div class="order-status">
          <h3 class="mobile-status">
            Status do Pedido: <MdOrdersStatusChip :status="order.status" />
            <QRCodePix
              v-if="order.status === 'pending'"
              class="mt-6"
              :qr-code-img="qrCodeImage"
              :pix-code="pixCode"
            />
          </h3>
          <VStepper
            v-model="statusStep"
            hide-actions
            class="status-stepper desktop-status"
            elevation="0"
            :items="['Aguardando Pagamento', 'Loja Notificada', 'Pedido Enviado', 'Pedido Entregue']"
          >
            <template #item.1>
              <QRCodePix
                :qr-code-img="qrCodeImage"
                :pix-code="pixCode"
              />
            </template>
          </VStepper>
        </div>

        <StatusActions
          :status="order.status"
          @on-change-status="changeStatus"
        />

        <p class="status-message">
          {{ statusMessage }}
        </p>

        <div class="order-info">
          <p>
            Data do pedido: {{ formatDate(order.createdAt) }}
          </p>

          <p>
            Tipo de pagamento: {{ order.paymentData.type === 'pix' ? 'Pix' : 'Cartão de Crédito' }}
          </p>
        </div>

        <VCardText class="content">
          <div class="products">
            <h4>Produtos Comprados</h4>
            <VList
              dense
              class="products"
            >
              <VListItem
                v-for="item in order.items"
                :key="item.productId._id"
                class="product-item"
              >
                <img
                  :src="item.productId.image?.[0] || '/placeholder.png'"
                  alt="Imagem do Produto"
                  class="product-image"
                >
                <br>
                <MdProductDetailsSeeButton :product-id="item.productId._id" />
                <VListItemContent>
                  <VListItemTitle class="product-name">
                    {{ item.productId.name }}
                  </VListItemTitle>
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

            <MdCalcProductSummary
              :cart-products="products"
              :total="totalAmount"
            />
          </div>
        </VCardText>
      </div>

      <div v-else>
        <p class="error-message">
          Não foi possível carregar os detalhes do pedido.
        </p>
      </div>

      <ElAccordion title="Tem dúvidas ou precisa de assistência com seu pedido? Estamos à disposição para ajudar.">
        <ElContactForm :additional-info="additionalInformationContact" />
      </ElAccordion>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import QRCodePix from '~/components/Md/Orders/Details/QRCodePix.vue'
import StatusActions from '~/components/Md/Orders/Details/StatusActions.vue'

definePageMeta({
  middleware: ['02-auth'],
})

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { order, loading, qrCodeImage, pixCode, fetchOrder, changeStatus } = useOrderById(id)
const { userData } = useUser()

const additionalInformationContact = computed(() => {
  return `orderId: ${id} \n orderDetails: ${JSON.stringify(order.value)}`
})

const statusMessage = computed(() => {
  if (!order.value) return ''

  switch (order.value.status) {
    case 'pending':
      return 'O pagamento do seu pedido ainda não foi identificado. Por favor, realize o pagamento para que possamos processar e enviar seu(s) produto(s).'
    case 'paid':
      return 'O pagamento do seu pedido foi confirmado. Aguardando o envio do(s) produto(s) pela loja.'
    case 'product_sent':
      return 'Seu pedido foi enviado pela loja e está a caminho. Por favor, aguarde a entrega.'
    case 'finished':
      return 'Seu pedido foi entregue com sucesso. Agradecemos pela sua compra! Caso tenha alguma dúvida, estamos à disposição.'
    default:
      return 'Houve um status desconhecido em relação ao seu pedido. Entre em contato com nosso suporte para mais informações.'
  }
})

const products = computed(() => {
  if (!order.value) return []

  return order.value.items.map(item => ({
    quantity: item.quantity,
    ...item.productId,
  }))
})

const statusStep = computed(() => {
  switch (order.value?.status) {
    case 'pending':
      return 1
    case 'paid':
      return 2
    case 'product_sent':
      return 3
    case 'finished':
      return 4
    default:
      return 0
  }
})

const totalAmount = computed(() =>
  order.value?.items?.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0,
  ).toFixed(2) || '0.00',
)

watch(userData, () => {
  if (!userData.value) {
    goToOrders()
  }
})
</script>

<style scoped lang="scss">
.order-details {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;

  .actions {
    display: flex;
    justify-content: space-between;
  }

  .status-message {
    font-weight: 700;
    font-size: 1.5rem;
    text-align: center;
    padding: 16px;
    border-radius: 4px;
    background-color: var(--primary-color-100);
    color: var(--primary-color-700);

    @media screen and (max-width: $mobile-breakpoint) {
      font-size: 1.2rem;
    }
  }

  .order-info {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 1.2rem;

    p {
      font-weight: bold;
      background-color: var(--primary-color-700);
      color: white;
      padding: 12px;
      border-radius: 4px;
    }

    @media screen and (max-width: $mobile-breakpoint) {
      font-size: 1rem;
      p {
        width: 100%;
        text-align: center;
      }
    }
  }

  .content {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
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
    text-align: center;

    .status-stepper {
      margin-top: 16px;
      justify-content: center;
    }

    .mobile-status {
      margin-bottom: 16px;
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
    min-width: 220px;
  }

  .product-item {
    padding: 12px;
    height: max-content;
    border: 1px solid rgba(128, 128, 128, 0.31);
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 16px;

    .product-name {
      max-width: 300px;
    }

    @media screen and (max-width: $mobile-breakpoint) {
      width: 100%;

      .product-name {
        max-width: 70vw;
      }
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
