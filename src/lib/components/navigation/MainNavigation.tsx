import {HStack, Link} from "@chakra-ui/react"
import NextLink from "next/link"
import {useAuth} from "lib/hooks/useAuth"

const MainNavigation = () => {
  const {Logout} = useAuth()
  return (
    <HStack width="full" align="center">
      <NextLink href="/products" passHref>
        <Link pl="2" pr="2">
          Products
        </Link>
      </NextLink>
      <NextLink href="/orders" passHref>
        <Link pl="2" pr="2">
          Orders
        </Link>
      </NextLink>
      <NextLink href="/buyers" passHref>
        <Link pl="2" pr="2">
          Users
        </Link>
      </NextLink>
      <NextLink href="/" passHref>
        <Link pl="2" pr="2" onClick={() => Logout()}>
          Log out
        </Link>
      </NextLink>
    </HStack>
  )
}

export default MainNavigation
