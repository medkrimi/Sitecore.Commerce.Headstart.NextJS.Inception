import {Image, Box, Flex, Link, Text, useColorMode} from "@chakra-ui/react"
import NextLink from "next/link"

const FooterLogo = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  return (
    // <Flex width="full" align="center">
    //   <Box alignContent="left">
    <NextLink href="/" passHref>
      <Link>
        {colorMode === "dark" ? (
          <Image objectFit="inherit" src="/Brand_Logo_White.png" alt="Sitecore" maxW="200px" />
        ) : (
          <Image objectFit="inherit" src="/Brand_Logo.png" alt="Sitecore" maxW="200px" />
        )}
      </Link>
    </NextLink>
    //   </Box>
    // </Flex>
  )
}

export default FooterLogo
