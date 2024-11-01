export interface IProduct {
    id: string
    name: string
    price: number
    description: string
    image: string
}

export interface IProductFilters {
    search?: string
    productType?: string
}
