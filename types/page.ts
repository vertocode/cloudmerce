export interface IBannerSection {
  id?: string
  type: 'banner'
  backgroundImage: string
  title?: string
  description?: string
  pathname?: string
}

export interface IProductCarouselSection {
  id?: string
  type: 'product-carousel'
  title?: string
  productIds: string[]
}

export interface IRichTextSection {
  id?: string
  type: 'rich-text'
  content: string
}

export interface IProductListingSection {
  id?: string
  type: 'product-listing'
  title?: string
  productTypeFilter?: string
  searchFilter?: string
}

export type IPageSection = IBannerSection | IProductCarouselSection | IRichTextSection | IProductListingSection

export interface IPage {
  _id: string
  ecommerceId: string
  handle: string
  title: string
  sections: IPageSection[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IPageFormData {
  handle: string
  title: string
  sections: IPageSection[]
  isActive: boolean
}
