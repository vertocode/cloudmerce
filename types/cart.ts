import type {IProductResponse} from "~/types/product";

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
