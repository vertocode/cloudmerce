export type OrderStatus = 'pending' | 'paid' | 'product_sent' | 'finished'
export type PaymentMethod = 'pix' | 'credit_card'

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
  type: PaymentMethod
  qrCode?: string
  pixCode?: string
  totalAmount: number
}

export interface Order {
  _id: string
  ecommerceId: string
  status: OrderStatus
  userId: string
  items: OrderItem[]
  paymentData: PaymentData
  createdAt: string
  updatedAt: string
}
