import {AddEditForm} from "lib/components/catalogs"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new user group",
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
      <AddEditForm />
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
