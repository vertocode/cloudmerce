import type { IPageSection } from './page'

export interface IMenuChildItem {
  label: string
  link: string
}

export interface IMenuNavigationItem {
  label: string
  link?: string
  children?: IMenuChildItem[]
}

export interface IMenuDropdownItem {
  label: string
  link: string
  visibleOn: 'desktop' | 'mobile' | 'both'
}

export interface IMenuConfig {
  useCustomMenu: boolean
  navigationItems: IMenuNavigationItem[]
  dropdownItems: IMenuDropdownItem[]
}

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
  mp?: {
    accessToken?: string
    refreshToken?: string
    userId?: string
    publicKey?: string
  }
  homepage?: {
    useCustomLayout: boolean
    sections: IPageSection[]
  }
  menu?: IMenuConfig
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface IWhitelabelError {
  code: number
  message: string
}
