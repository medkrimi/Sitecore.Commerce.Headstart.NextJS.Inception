import {ProductXPs} from "lib/types/ProductXPs"
import {
  Product,
  Filters,
  ListPageWithFacets,
  Me,
  Products,
  MetaWithFacets,
  RequiredDeep,
  SearchType,
  ApiRole,
  Configuration,
  CookieOptions,
  Auth,
  Tokens,
  DecodedToken,
  Spec,
  Specs,
  Variant,
  IntegrationEvents,
  Payments,
  Order,
  OrderWorksheet,
  Payment,
  LineItems,
  Orders
} from "ordercloud-javascript-sdk"
import parseJwt from "../../lib/utils/parseJwt"

export interface ProductListOptions {
  catalogID?: string
  categoryID?: string
  search?: string
  page?: number
  pageSize?: number
  depth?: string
  searchOn?: string[]
  sortBy?: string[]
  filters?: Filters
  searchType?: SearchType
}

export interface OcConfig {
  clientId: string
  scope: ApiRole[]
  baseApiUrl?: string
  allowAnonymous?: boolean
  cookieOptions?: CookieOptions
}

export interface LoginActionRequest {
  username: string
  password: string
  remember?: boolean
}

export interface OcAuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  decodedToken?: DecodedToken
  isAnonymous: boolean
  loading: boolean
  initialized: boolean
}

const ocConfig = {
  //clientId: "4A9F0BAC-EC1D-4711-B01F-1A394F72F2B6",
  clientId: "3DA87C8C-FE92-47E7-BBB6-AF88423FD7D46",
  baseApiUrl: "https://sandboxapi.ordercloud.io",
  scope: [
    "FullAccess",
    "Shopper",
    "MeAddressAdmin",
    "CategoryReader"
  ] as ApiRole[] /* Default user role */,
  allowAnonymous:
    Boolean("false") /* Whether anonymous product browsing is allowed */,
  hostedApp: true,
  marketplaceID: "SitecoreCommerce",
  marketplaceName: "Sitecore Commerce",
  appname: "Sitecore Commerce",
  middlewareUrl: "https://localhost:5001",
  translateBlobUrl:
    "https://sitecorecommerce.blob.core.windows.net/ngx-translate/i18n/",
  blobStorageUrl: "https://sitecorecommerce.blob.core.windows.net",
  orderCloudApiUrl: "https://sandboxapi.ordercloud.io",
  cookieOptions: null
}

// export async function GetProductList(
//   options: ProductListOptions
// ): Promise<RequiredDeep<Product<ProductXPs>>> {
//   var products = await Products.List<ProductXPs>(options)
//   return products.Items
// }

export function GetAuthenticationStatus(): OcAuthState {
  const initialAccessToken = Tokens.GetAccessToken()
  let isAnonymous = true
  let isAdmin = false
  let decodedToken: DecodedToken

  if (initialAccessToken) {
    decodedToken = parseJwt(initialAccessToken) as DecodedToken
    isAnonymous = !!decodedToken.orderid
    isAdmin = decodedToken.usrtype === "admin"
  }

  var result: OcAuthState = {
    isAuthenticated: !!initialAccessToken,
    isAnonymous: isAnonymous,
    isAdmin: isAdmin,
    decodedToken: decodedToken,
    initialized: true,
    loading: false
  }

  return result
}

export function SetConfiguration() {
  Configuration.Set({
    clientID: ocConfig.clientId,
    baseApiUrl: ocConfig.baseApiUrl,
    cookieOptions: ocConfig.cookieOptions
  })
}

export async function Login(
  username: string,
  password: string,
  remember: boolean
) {
  var config = Configuration.Get()
  const response = await Auth.Login(
    username,
    password,
    config.clientID,
    ocConfig.scope
  ).catch()

  Tokens.SetAccessToken(response.access_token)
  if (remember && response.refresh_token) {
    Tokens.SetRefreshToken(response.refresh_token)
  }
}

export async function Logout() {
  Tokens.RemoveAccessToken()
  Tokens.RemoveRefreshToken()

  if (ocConfig.allowAnonymous) {
    const response = await Auth.Anonymous(ocConfig.clientId, ocConfig.scope)
    Tokens.SetAccessToken(response.access_token)
    Tokens.SetRefreshToken(response.refresh_token)
  }
}

export interface ComposedProduct {
  Product: RequiredDeep<Product<ProductXPs>>
  Specs: RequiredDeep<Spec<any, any>>[]
  Variants: RequiredDeep<Variant<any>>[]
}

export async function GetComposedProduct(
  productId: string
): Promise<ComposedProduct> {
  if (productId) {
    var product = await Products.Get(productId).catch()
    var specs = await Products.ListSpecs(productId).catch()
    var variants = await Products.ListVariants(productId).catch()
    var composedProduct: ComposedProduct = {
      Product: product,
      Specs: specs?.Items,
      Variants: variants?.Items
    }

    return composedProduct
  }

  return null
}

export interface ComposedOrder {
  Order: OrderWorksheet
  Payment: Payment<any, any>[]
}

export async function GetCurrentOrder() {
  let composedOrder: ComposedOrder
  const sortBy = "DateCreated" as any // TODO: Not sure how to make this work better... might need a fix in the SDK
  const response = await Me.ListOrders({
    sortBy,
    filters: {Status: "Unsubmitted"}
  })
  const firstOrder = response.Items[0]
  if (firstOrder) {
    const worksheet = await IntegrationEvents.GetWorksheet(
      "Outgoing",
      firstOrder.ID
    )
    if (
      worksheet.Order.BillingAddress &&
      worksheet.ShipEstimateResponse &&
      worksheet.ShipEstimateResponse.ShipEstimates &&
      worksheet.ShipEstimateResponse.ShipEstimates.length &&
      worksheet.ShipEstimateResponse.ShipEstimates.filter(
        (se) => !se.SelectedShipMethodID
      ).length === 0
    ) {
      const response = await Payments.List("Outgoing", worksheet.Order.ID, {
        pageSize: 100
      })
      composedOrder.Payment = response.Items
    }

    composedOrder.Order = worksheet
    return composedOrder
  }
}

export async function RemoveLineItem(lineItemId) {
  var currentOrder = await GetCurrentOrder()
  var orderId = currentOrder?.Order?.Order?.ID
  await LineItems.Delete("Outgoing", orderId, lineItemId)
  return IntegrationEvents.GetWorksheet("Outgoing", orderId)
}

export async function UpdateLineItem(lineItem) {
  var currentOrder = await GetCurrentOrder()
  var orderId = currentOrder?.Order?.Order?.ID
  await LineItems.Save("Outgoing", orderId, lineItem?.ID, lineItem)
  return IntegrationEvents.GetWorksheet("Outgoing", orderId)
}

export async function CreateLineItem(lineItemId) {
  var currentOrder = await GetCurrentOrder()
  var orderId = currentOrder?.Order?.Order?.ID

  // initialize the order if it doesn't exist already
  if (!orderId) {
    const orderResponse = await Orders.Create("Outgoing", {})
    orderId = orderResponse.ID
  }

  // create the new line item
  await LineItems.Create("Outgoing", orderId, lineItemId)
  return IntegrationEvents.GetWorksheet("Outgoing", orderId)
}
