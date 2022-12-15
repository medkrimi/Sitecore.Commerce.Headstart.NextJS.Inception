import {AuthContext} from "lib/context/auth-context"
import {useContext, useMemo} from "react"

export type HasAccessFunction = (permissions: string[]) => boolean
export type AccessQualifier = string | string[] | HasAccessFunction

export const isAllowedAccess = (
  permissions: string[],
  hasAccess: AccessQualifier
) => {
  switch (typeof hasAccess) {
    case "string":
      return permissions.includes(hasAccess)
    case "function":
      return hasAccess(permissions)
    default:
      var result = false
      hasAccess.forEach((p) => {
        if (permissions.includes(p)) result = true
      })
      return result
  }
}

const useHasAccess = (accessQualifier: AccessQualifier) => {
  const context = useContext(AuthContext)

  const allowed = useMemo(() => {
    return context.assignedRoles
      ? isAllowedAccess(context.assignedRoles, accessQualifier)
      : false
  }, [context.assignedRoles, accessQualifier])

  return allowed
}

export default useHasAccess
