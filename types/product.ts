export enum UserFieldTypeLabel {
    text = 'Texto',
    number = 'Número',
    options = 'Opções'
}

export type UserFieldType = keyof typeof UserFieldTypeLabel

export interface UserField {
    label: string
    type: UserFieldType
    options?: string[]
    value?: string
}

export interface IProduct {
    id: string
    name: string
    price: number
    description: string
    productType: string
    image: string | string[]
    fields: UserField[]
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
}

export interface IProductFilters {
    search?: string
    productType?: string
}
