export interface IWhitelabel {
  baseUrl: string
  name: string
  description?: string
  primaryColor?: string
  secondaryColor?: string
  banner: {
    title: string
    description?: string
  }
  logoUrl?: string
  productTypes: string[]
  socialMedia: {
    wpp?: string
    instagram?: string
    facebook?: string
    twitter?: string
  }
  pixKey?: {
    phone?: string
    cpf?: string
    other?: string
  }
  createdAt: string
  updatedAt: string
}

export interface IWhitelabelError {
  code: number
  message: string
}
