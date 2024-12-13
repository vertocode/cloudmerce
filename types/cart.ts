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

export interface IAddItemToCartResponse extends ICartResponse {
  items: {
    productId: string
    quantity: number
    _id: string
  }[]
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
}
