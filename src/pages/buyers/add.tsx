import {Box, Container} from "@chakra-ui/react"
import {AddEditForm} from "../../lib/components/buyers/AddEditForm"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new buyer",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedAddEditForm() {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="20px">
        <AddEditForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
