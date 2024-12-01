import type { OrderStatus } from '~/types/order'

export default function (statusCode: OrderStatus) {
  switch (statusCode) {
    case 'pending_payment':
      return 'Aguardando Pagamento'
    case 'paid':
      return 'Loja Notificada'
    case 'product_sent':
      return 'Pedido Enviado'
    case 'finished':
      return 'Pedido Entregue'
    default:
      return statusCode
  }
}
