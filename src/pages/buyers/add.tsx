import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {AddEditForm} from "../../lib/components/buyers"

const ProtectedAddEditForm = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <AddEditForm />
    </ProtectedContent>
  )
}

export default ProtectedAddEditForm
