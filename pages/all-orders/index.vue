<template>
  <div class="orders-list">
    <VRow justify="center">
      <VCol
        cols="12"
        md="8"
      >
        <h1>Todos os pedidos</h1>
      </VCol>
    </VRow>
    <VRow
      justify="center"
      align="center"
    >
      <div v-if="loading">
        <VProgressCircular
          indeterminate
          color="primary"
        />
        <span>Carregando pedidos...</span>
      </div>
      <VCol
        v-else
        cols="12"
        md="12"
      >
        <VTable
          v-if="orders.length && userData"
          dense
        >
          <thead>
            <tr>
              <th>Pedido nº</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order._id"
            >
              <td>{{ order._id }}</td>
              <td><MdOrdersStatusChip :status="order.status" /></td>
              <td><strong>R$ {{ calculateTotal(order.items) }}</strong></td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>
                <VBtn
                  color="primary"
                  variant="elevated"
                  @click="goToOrderDetails(order._id)"
                >
                  Ver Detalhes
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
        <p
          v-else
          class="no-orders"
        >
          Você ainda não possui pedidos.
        </p>
      </VCol>
    </VRow>
    <VPagination
      v-model="page"
      :length="totalPages"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['03-admin-auth'],
})

const page = ref<number>(1)
const pageSize = ref<number>(10)

const { orders, loading, totalPages, fetchOrders } = useAllOrders()
const router = useRouter()

const calculateTotal = (items: any[]) =>
  items.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2)

const goToOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

const { userData } = useUser()

watch(userData, () => {
  fetchOrders()
})

watch([page, pageSize], () => {
  console.log(page.value, 'page')
  console.log(pageSize.value, 'pageSize')
  fetchOrders({
    page: page.value,
    pageSize: pageSize.value,
  })
})

callOnce(() => {
  fetchOrders()
})
</script>

<style scoped lang="scss">
.orders-list {
  .no-orders {
    text-align: center;
    color: gray;
    margin-top: 16px;
  }

  table {
    margin-bottom: 16px;

    th {
      text-align: left;
      padding: 8px;
      background-color: #f5f5f5;
      font-weight: bold;
    }

    td {
      padding: 8px;
      border: 1px solid #ddd;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #f1f1f1;
    }
  }
}
</style>
