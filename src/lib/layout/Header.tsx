import {
  HStack,
  VStack,
  useColorMode,
  useColorModeValue,
  Heading,
  Flex
} from "@chakra-ui/react"
import HeaderLogo from "lib/components/branding/HeaderLogo"
import {useOcDispatch, useOcSelector} from "../redux/ocStore"
import AcountNavigation from "lib/components/navigation/AcountNavigation"

const Header = () => {
  const dispatch = useOcDispatch()
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue("headerBg.500", "headerBg.900")
  const color = useColorModeValue("textColor.900", "textColor.100")

  return (
    <Flex
      as="header"
      width="full"
      align="center"
      backgroundColor={bg}
      color={color}
      position="fixed"
      w="100%"
      zIndex="overlay"
      top="0"
    >
      <HStack
        as="section"
        w="100%"
        p="2"
        pl="10"
        pr="10"
        maxHeight="100"
        boxShadow="md"
      >
        <HStack justifyContent="space-between" w="100%">
          <HStack justifyContent="flex-start" color={color}>
            <HeaderLogo />
            <Heading
              color="gray.500"
              fontSize="large"
              pl="10"
              fontWeight="normal"
            >
              Commerce Administration
            </Heading>
          </HStack>
          <HStack justifyContent="flex-end" color={color}>
            <AcountNavigation />
          </HStack>
        </HStack>
      </HStack>
    </Flex>
  )
}

export default Header
