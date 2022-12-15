import {OcConfig} from "lib/services/ordercloud.service"
import {ApiRole} from "ordercloud-javascript-sdk"

const ocConfig: OcConfig = {
  clientId:
    process.env.NEXT_PUBLIC_OC_CLIENT_ID ||
    "4A9F0BAC-EC1D-4711-B01F-1A394F72F2B6",
  baseApiUrl:
    process.env.NEXT_PUBLIC_OC_API_URL || "https://sandboxapi.ordercloud.io",
  scope: [
    "FullAccess",
    "Shopper",
    "MeAddressAdmin",
    "CategoryReader"
  ] as ApiRole[] /* Default user role */,
  allowAnonymous: false,
  cookieOptions: null
}

export default ocConfig
