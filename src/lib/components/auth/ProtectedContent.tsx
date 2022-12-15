import {AuthContext} from "lib/context/auth-context"
import React, {PropsWithChildren} from "react"
import {AccessQualifier, isAllowedAccess} from "../../hooks/useHasAccess"

interface ProtectedContentProps extends PropsWithChildren {
  /**
   * a single role, array of roles, or a function that determines whether
   * or not a user should have access to this content
   */
  hasAccess: AccessQualifier
}

/**'
 * This component should be used to hide content based on ordercloud roles
 */
const ProtectedContent = (props: ProtectedContentProps) => {
  const {hasAccess, children} = props
  return (
    <AuthContext.Consumer>
      {(context) => {
        if (
          context &&
          context.assignedRoles?.length &&
          isAllowedAccess(context.assignedRoles, hasAccess)
        ) {
          return children
        } else {
          return <></>
        }
      }}
    </AuthContext.Consumer>
  )
}

export default ProtectedContent
