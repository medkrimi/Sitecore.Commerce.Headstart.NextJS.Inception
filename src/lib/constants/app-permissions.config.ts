import {ApiRole} from "ordercloud-javascript-sdk"

type AppPermission =
  | "OrderManager"
  | "ProductManager"
  | "BuyerManager"
  | "ReportViewer"
  | "MeManager"

export const appPermissions: Record<AppPermission, ApiRole[]> = {
  OrderManager: ["OrderAdmin"],
  ProductManager: ["ProductAdmin", "PromotionAdmin", "ProductFacetAdmin"],
  BuyerManager: [
    "BuyerAdmin",
    "BuyerUserAdmin",
    "CatalogAdmin",
    "UserGroupAdmin",
    "UserGroupReader",
    "CategoryAdmin",
    "CategoryReader"
  ],
  ReportViewer: ["OrderAdmin", "ProductAdmin"],
  MeManager: ["MeAdmin", "MeXpAdmin"]
}
