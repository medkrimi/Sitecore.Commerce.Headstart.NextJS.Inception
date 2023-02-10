import React, {useEffect, useState} from "react"

import {Box} from "@chakra-ui/react"
import ProductSearch from "lib/components/products/ProductSearch"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Products List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const Products = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const searchQuery = router.query.query as string
    setQuery(searchQuery)
  }, [router.query.query])

  return (
    <>
      <Box pl="GlobalPadding">
        <ProductSearch query={query} />
      </Box>
    </>
  )
}

const ProtectedProducts = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <Products />
    </ProtectedContent>
  )
}

export default ProtectedProducts
