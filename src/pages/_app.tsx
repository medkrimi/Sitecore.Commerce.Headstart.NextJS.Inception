/* eslint-disable react/jsx-props-no-spreading */

import {AlertStack} from "lib/components/AlertStack"
import type {AppProps} from "next/app"
import {Chakra} from "lib/components/Chakra"
import {DefaultSeo} from "next-seo"
import Head from "next/head"
import Layout from "lib/layout/Layout"
import {SetConfiguration} from "lib/scripts/OrdercloudService"
import defaultSEOConfig from "../../next-seo.config"

const MyApp = ({Component, pageProps}: AppProps) => {
  SetConfiguration()
  return (
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
  )
}

export default MyApp
