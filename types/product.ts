import type { StockOptions } from '~/components/Md/ProductForm/types/stock'

export enum UserFieldTypeLabel {
  text = 'Texto',
  number = 'Número',
  options = 'Opções',
}

export type UserFieldType = keyof typeof UserFieldTypeLabel

export interface UserField {
  label: string
  type: UserFieldType
  options?: string[]
  value?: string
}

export interface Stock {
  type: StockOptions
  quantity?: number
}

export interface IProduct {
  id: string
  name: string
  price: number
  description: string
  productType: string
  image: string | string[]
  stock: Stock
  fields: UserField[]
}

export interface IGetProductsResponse {
  products: IProductResponse[]
  totalPages: number
  limit: number
  page: number
}

export interface IProductResponse {
  createdAt: string
  ecommerceId: string
  name: string
  description: string
  _id: string
  productType: string
  image: string[] | string
  fields: UserField[]
  price: number
  updatedAt: string
  stock: Stock
}

export interface IProductFilters {
  search?: string
  productType?: string
}
