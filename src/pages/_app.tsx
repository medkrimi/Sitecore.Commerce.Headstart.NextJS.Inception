/* eslint-disable react/jsx-props-no-spreading */
import {DefaultSeo} from "next-seo"
import type {AppProps} from "next/app"
import Head from "next/head"
import defaultSEOConfig from "../../next-seo.config"
import {Chakra} from "lib/components/Chakra"
import Layout from "lib/layout/Layout"
import OcProvider from "../lib/redux/ocProvider"
import {ApiRole} from "ordercloud-javascript-sdk"

const ocConfig = {
  clientId: "4A9F0BAC-EC1D-4711-B01F-1A394F72F2B6",
  baseApiUrl: "https://sandboxapi.ordercloud.io",
  scope: [
    "FullAccess",
    "Shopper",
    "MeAddressAdmin",
    "CategoryReader"
  ] as ApiRole[] /* Default user role */,
  allowAnonymous:
    Boolean("true") /* Whether anonymous product browsing is allowed */,
  hostedApp: true,
  marketplaceID: "SitecoreCommerce",
  marketplaceName: "Sitecore Commerce",
  appname: "Sitecore Commerce",
  middlewareUrl: "https://localhost:5001",
  translateBlobUrl:
    "https://sitecorecommerce.blob.core.windows.net/ngx-translate/i18n/",
  blobStorageUrl: "https://sitecorecommerce.blob.core.windows.net",
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
