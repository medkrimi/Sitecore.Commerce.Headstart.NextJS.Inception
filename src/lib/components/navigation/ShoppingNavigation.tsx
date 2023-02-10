import NextLink from "next/link"
import {Flex, Link, VStack, Text} from "@chakra-ui/react"

const ShoppingNavigation = () => {
  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
          My Account
        </Text>
        <NextLink href="/home" passHref>
          <Link>Check Out</Link>
        </NextLink>
        <NextLink href="/blog" passHref>
          <Link>Cart</Link>
        </NextLink>
        <NextLink href="/pages" passHref>
          <Link>Products</Link>
        </NextLink>
        <NextLink href="/shop" passHref>
          <Link>Shop</Link>
        </NextLink>
        <NextLink href="/shop" passHref>
          <Link>Legal</Link>
        </NextLink>
      </VStack>
    </Flex>
  )
}

export default ShoppingNavigation
