import NextLink from "next/link"
import {Box, Flex, HStack, Link} from "@chakra-ui/react"
import logout from "../../redux/ocAuth/logout"
import {useOcDispatch, useOcSelector} from "../../redux/ocStore"

const MainNavigation = () => {
  const dispatch = useOcDispatch()

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
      <NextLink href="/users" passHref>
        <Link pl="2" pr="2">
          Users
        </Link>
      </NextLink>
      <NextLink href="/logoff" passHref>
        <Link pl="2" pr="2" onClick={() => dispatch(logout())}>
          Log out
        </Link>
      </NextLink>
    </HStack>
  )
}

export default MainNavigation
