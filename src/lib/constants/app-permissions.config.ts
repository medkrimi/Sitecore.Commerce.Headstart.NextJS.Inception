import {ApiRole} from "ordercloud-javascript-sdk"

type AppPermission =
  | "OrderManager"
  | "ProductManager"
  | "BuyerManager"
  | "ReportViewer"
  | "MeManager"

export const appPermissions: Record<AppPermission, ApiRole[]> = {
  OrderManager: ["OrderAdmin"],
  ProductManager: ["ProductAdmin", "PromotionAdmin"],
  BuyerManager: [
    "BuyerAdmin",
    "BuyerUserAdmin",
    "CatalogAdmin",
    "UserGroupAdmin",
    "UserGroupReader"
  ],
  ReportViewer: ["OrderAdmin", "ProductAdmin"],
  MeManager: ["MeAdmin", "MeXpAdmin"]
}
