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
          <Image
            boxSize="250px"
            objectFit="inherit"
            src="/Brand_Logo_White.png"
            alt="Sitecore"
            maxHeight="50"
          />
        ) : (
          <Image
            boxSize="250px"
            objectFit="inherit"
            src="/Brand_Logo.png"
            alt="Sitecore"
            maxHeight="50"
          />
        )}
      </Link>
    </NextLink>
    //   </Box>
    // </Flex>
  )
}

export default FooterLogo
