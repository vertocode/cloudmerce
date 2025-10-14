export type Role = 'user' | 'admin' | 'superadmin'

interface UserAddress {
  cep: string
  street: string
  number: string
  city: string
  state: string
  country: string
  neighborhood: string
}

export interface User {
  _id: string
  createdAt: string
  email: string
  name: string
  birthday: string
  role: Role
  password: string
  phone?: string
  hasWhatsapp?: boolean
  cpf?: string
  address?: UserAddress
}
