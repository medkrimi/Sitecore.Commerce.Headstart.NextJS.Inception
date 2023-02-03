import {CreateUpdateForm} from "../../../../lib/components/users"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {usersService} from "lib/api"

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
        <CreateUpdateForm ocService={usersService} />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
