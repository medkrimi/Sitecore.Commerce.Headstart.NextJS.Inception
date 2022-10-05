import NextLink from "next/link"
import {Box, Flex, Link, VStack, Heading, Text} from "@chakra-ui/react"

const TopCategoriesNavigation = () => {
  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
          Top Categories
        </Text>
        <NextLink href="/home" passHref>
          <Link>Category 1</Link>
        </NextLink>
        <NextLink href="/blog" passHref>
          <Link>Category 2</Link>
        </NextLink>
        <NextLink href="/pages" passHref>
          <Link>Category 3</Link>
        </NextLink>
        <NextLink href="/shop" passHref>
          <Link>Category 4</Link>
        </NextLink>
        <NextLink href="/shop" passHref>
          <Link>Category 5</Link>
        </NextLink>
      </VStack>
    </Flex>
  )
}

export default TopCategoriesNavigation
