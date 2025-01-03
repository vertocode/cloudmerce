export interface IWhitelabel {
  _id: string
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
  contact: {
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface IWhitelabelError {
  code: number
  message: string
}
