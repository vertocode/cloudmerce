<template>
  <div class="all-orders">
    <div v-if="loading">
      <VProgressCircular
        indeterminate
        color="primary"
      />
      <span>Carregando pedidos...</span>
    </div>
    <div v-else>
      <VTable
        v-if="orders.length"
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
                size="small"
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
        Nenhum pedido encontrado.
      </p>
      <VPagination
        v-if="totalPages > 1"
        v-model="page"
        :length="totalPages"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const page = ref<number>(1)
const pageSize = ref<number>(10)

const { orders, loading, totalPages, fetchOrders } = useAllOrders()
const router = useRouter()

const calculateTotal = (items: any[]) =>
  items.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2)

const goToOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

watch([page, pageSize], () => {
  fetchOrders({
    page: page.value,
    pageSize: pageSize.value,
  })
})

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="scss">
.all-orders {
  .no-orders {
    text-align: center;
    color: #86868b;
    margin-top: 16px;
  }

  table {
    th {
      text-align: left;
      padding: 12px;
      background-color: #f5f5f7;
      font-weight: 600;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e5e7;
    }

    tr:hover {
      background-color: #f5f5f7;
    }
  }
}
</style>
