import NextLink from "next/link"
import {
  Box,
  Flex,
  Tag,
  Text,
  Link,
  VStack,
  Heading,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react"
import {ReactNode} from "react"

const InformationNavigation = () => {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
          About Us
        </Text>
        <NextLink href="/" passHref>
          <Link>Home</Link>
        </NextLink>
        <NextLink href="/blog" passHref>
          <Link>Blog</Link>
        </NextLink>
        <NextLink href="/about-us" passHref>
          <Link>About Us</Link>
        </NextLink>
        <NextLink href="/shop" passHref>
          <Link>
            Shop{" "}
            <Tag
              size={"sm"}
              bg={useColorModeValue("brand.500", "brand.700")}
              ml={2}
              color={useColorModeValue("textColor.900", "textColor.100")}
            >
              New
            </Tag>
          </Link>
        </NextLink>

        <NextLink href="/contact-us" passHref>
          <Link>Contact Us</Link>
        </NextLink>
      </VStack>
    </Flex>
  )
}

export default InformationNavigation
