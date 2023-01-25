import {HStack, Link} from "@chakra-ui/react"
import NextLink from "next/link"
import {useAuth} from "lib/hooks/useAuth"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

const MainNavigation = () => {
  const {Logout} = useAuth()
  return (
    <HStack width="full" align="center">
      <ProtectedContent hasAccess={appPermissions.ProductManager}>
        <NextLink href="/products" passHref>
          <Link pl="2" pr="2">
            Products
          </Link>
        </NextLink>
      </ProtectedContent>
      <ProtectedContent hasAccess={appPermissions.OrderManager}>
        <NextLink href="/orders" passHref>
          <Link pl="2" pr="2">
            Orders
          </Link>
        </NextLink>
      </ProtectedContent>
      <ProtectedContent hasAccess={appPermissions.BuyerManager}>
        <NextLink href="/buyers" passHref>
          <Link pl="2" pr="2">
            Users
          </Link>
        </NextLink>
      </ProtectedContent>

      <NextLink href="/" passHref>
        <Link pl="2" pr="2" onClick={() => Logout()}>
          Log out
        </Link>
      </NextLink>
    </HStack>
  )
}

export default MainNavigation
