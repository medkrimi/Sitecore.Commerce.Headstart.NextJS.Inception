import {Image, HStack, Link, useColorMode} from "@chakra-ui/react"
import NextLink from "next/link"

const HeaderLogo = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  return (
    <HStack>
      <NextLink href="/" passHref>
        <Link pt="2px">
          {colorMode === "dark" ? (
            <Image width="100%" maxW="250px" objectFit="contain" src="/Brand_Logo_White.png" alt="Sitecore" />
          ) : (
            <Image maxW="250px" width="100%" objectFit="contain" src="/Brand_Logo.png" alt="Sitecore" />
          )}
        </Link>
      </NextLink>
    </HStack>
  )
}

export default HeaderLogo
