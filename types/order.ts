export type OrderStatus = 'pending_payment' | 'paid' | 'product_sent' | 'finished'

export interface OrderItem {
  productId: {
    _id: string
    name: string
    price: number
    image?: string[]
  }
  quantity: number
  fieldValues?: {
    fieldLabel: string
    value: string
  }[]
}

interface PaymentData {
  type: 'pix' | 'card'
  qrCode?: string
  totalAmount: number
}

export interface Order {
  _id: string
  ecommerceId: string
  status: OrderStatus
  userId: string
  paymentIntentId: string
  paymentMethod: 'pix' | 'card'
  items: OrderItem[]
  paymentData: PaymentData
  createdAt: string
  updatedAt: string
}
