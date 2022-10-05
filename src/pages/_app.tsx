/* eslint-disable react/jsx-props-no-spreading */
import {DefaultSeo} from "next-seo"
import type {AppProps} from "next/app"
import Head from "next/head"

import defaultSEOConfig from "../../next-seo.config"
import {Chakra} from "lib/components/Chakra"
import Layout from "lib/layout/privatelayout"
import "lib/styles/globals.css"
import OcProvider from "../lib/redux/ocProvider"
import {ApiRole} from "ordercloud-javascript-sdk"
import Script from "next/script"

const ocConfig = {
  clientId: "7FE553C4-6FA4-4FF1-95BB-9A1440DC98B7",
  // "E2601798-28C2-4CC5-A863-4FEB6813E61F", // NEW ENV
  //"7FE553C4-6FA4-4FF1-95BB-9A1440DC98B7", // COMPOSABLE DEMO
  // "79D7E9EE-6937-4B01-B2B9-237BE02A282F", //HAHN SIZZLE
  // "090A8ADE-EFA7-4D30-878B-F7CAD2110885" /* This is the client ID of your seeded OrderCloud organization */,
  baseApiUrl: "https://sandboxapi.ordercloud.io",
  // "https://westeurope-sandbox.ordercloud.io", / EU
  //"https://sandboxapi.ordercloud.io" /* API Url, leave as is for Sandbox */,
  scope: [
    "Shopper",
    "MeAddressAdmin",
    "CategoryReader",
    "FullAccess"
  ] as ApiRole[] /* Default user role */,
  allowAnonymous:
    Boolean("false") /* Whether anonymous product browsing is allowed */,
  hostedApp: true,
  marketplaceID: "commercesizzle",
  marketplaceName: "Commerce Sizzle",
  appname: "Commerce Sizzle",
  middlewareUrl: "https://localhost:5001",
  translateBlobUrl:
    "https://headstartstoragemr.blob.core.windows.net/ngx-translate/i18n/",
  blobStorageUrl: "https://headstartstoragemr.blob.core.windows.net",
  orderCloudApiUrl: "https://sandboxapi.ordercloud.io"
}

const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <OcProvider config={ocConfig}>
      <Chakra>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Chakra>
    </OcProvider>
  )
}

export default MyApp
