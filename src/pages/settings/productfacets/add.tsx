import {AddEditForm} from "../../../lib/components/productfacets/AddEditForm"
import {Container} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a Product Facet",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const NewProductFacetsPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Product Facets" />
      <AddEditForm />
    </Container>
  )
}

const ProtectedProductFacetsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <NewProductFacetsPage />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsPage
