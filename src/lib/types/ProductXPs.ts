export interface ProductXPs {
  Name: string
  Images: XpImage[]
  SomeAdditionalCheckbox: boolean
}

export interface XpImage {
  Url: string
  ThumbnailUrl: string
}
