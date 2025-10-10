import type { IPageSection } from './page'

export interface IWhitelabel {
  _id: string
  baseUrl: string
  name: string
  description?: string
  hasMP?: boolean
  primaryColor?: string
  secondaryColor?: string
  banner: {
    title: string
    description?: string
    pathname?: string
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
  homepage?: {
    useCustomLayout: boolean
    sections: IPageSection[]
  }
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface IWhitelabelError {
  code: number
  message: string
}
