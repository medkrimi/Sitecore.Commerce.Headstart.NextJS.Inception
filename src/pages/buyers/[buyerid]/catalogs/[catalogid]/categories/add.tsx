import {AddEditForm} from "lib/components/categories"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new category",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedAddEditForm = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="20px">
        <AddEditForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
