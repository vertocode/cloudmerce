export interface IProduct {
    id: string
    name: string
    price: number
    description: string
    productType: string
    image: string | string[]
}

export interface IProductResponse {
    createdAt: string
    ecommerceId: string
    name: string
    description: string
    _id: string
    productType: string
    image: string[] | string
    price: number
    updatedAt: string
}

export interface IProductFilters {
    search?: string
    productType?: string
}
