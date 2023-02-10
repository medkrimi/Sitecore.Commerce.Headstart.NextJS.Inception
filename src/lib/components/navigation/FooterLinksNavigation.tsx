import NextLink from "next/link"
import {Flex, Link, Text, VStack} from "@chakra-ui/react"
import {ReactNode} from "react"

const FooterLinksNavigation = () => {
  const ListHeader = ({children}: {children: ReactNode}) => {
    return (
      <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
        {children}
      </Text>
    )
  }

  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <ListHeader>Policies</ListHeader>
        <NextLink href="/privacy-policy" passHref>
          <Link>Privacy Policy</Link>
        </NextLink>
        <NextLink href="/refund-policy" passHref>
          <Link>Refund Policy</Link>
        </NextLink>
        <NextLink href="/cookie-policy" passHref>
          <Link>Cookie Policy</Link>
        </NextLink>
        <NextLink href="/terms-and-conditions" passHref>
          <Link>Terms & Conditions</Link>
        </NextLink>
      </VStack>
    </Flex>
  )
}

export default FooterLinksNavigation
