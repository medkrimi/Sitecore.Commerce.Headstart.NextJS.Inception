import {Box} from "@chakra-ui/react"
import {AddEditForm} from "../../../../lib/components/users"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new user",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedAddEditForm = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <AddEditForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
