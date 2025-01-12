import type { IProduct, IProductResponse } from '~/types/product'

export interface IExpiredCartItem {
  id: string
  status: 'expired'
}

export interface ICartItem extends IProduct {
  status: 'active'
  quantity: number
}

interface ICartResponse {
  _id: string
  createdAt: string
  updatedAt: string
  ecommerceId: string
}

export interface IGetCartResponse extends ICartResponse {
  userId: string
  items: {
    productId: IProductResponse
    fieldValues: {
      fieldLabel: string
      value: string
      _id: string
    }[]
    quantity: number
    _id: string
  }[]
  code?: string
}

export interface ISubmitFnParams {
  paymentMethod: PaymentMethods
  creditCardData?: CreditCardData
}

export interface CreditCardData {
  cardHolderName: string
  cardCpf: string
  cardNumber: string
  cardExpiryDate: string
  cardCvv: string
}

export enum PaymentMethods {
  Pix = 'pix',
  CreditCard = 'credit_card',
}

export enum PaymentMethodLabels {
  pix = 'Pix',
  credit_card = 'Cartão de Crédito',
}
