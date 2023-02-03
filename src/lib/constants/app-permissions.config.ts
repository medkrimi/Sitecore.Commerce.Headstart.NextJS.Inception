import {ApiRole} from "ordercloud-javascript-sdk"

type AppPermission =
  | "OrderManager"
  | "ProductManager"
  | "BuyerManager"
  | "ReportViewer"
  | "MeManager"
  | "SupplierManager"
  | "SettingsManager"

export const appPermissions: Record<AppPermission, ApiRole[]> = {
  OrderManager: ["OrderAdmin"],
  ProductManager: ["ProductAdmin", "PromotionAdmin", "PriceScheduleAdmin", "PriceScheduleReader"],
  BuyerManager: [
    "BuyerAdmin",
    "BuyerUserAdmin",
    "CatalogAdmin",
    "UserGroupAdmin",
    "UserGroupReader",
    "CategoryAdmin",
    "CategoryReader"
  ],
  SupplierManager: ["SupplierAdmin", "SupplierAddressAdmin", "SupplierUserAdmin", "SupplierUserGroupAdmin"],
  ReportViewer: ["OrderAdmin", "ProductAdmin"],
  MeManager: ["MeAdmin", "MeXpAdmin"],
  SettingsManager: ["ProductFacetAdmin"]
}
