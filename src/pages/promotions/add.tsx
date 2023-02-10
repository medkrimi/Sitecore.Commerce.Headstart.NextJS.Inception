import {AddEditForm} from "../../lib/components/promotions/AddEditForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new promotion",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitcher: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedAddEditForm() {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Box padding="20px">
        <AddEditForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
