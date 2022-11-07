import {Box, HStack} from "@chakra-ui/react"
import type {ReactNode} from "react"
import Footer from "./Footer"
import Header from "./Header"
import LeftNavigation from "lib/components/navigation/SideNavigation"
import {GetAuthenticationStatus} from "lib/scripts/OrdercloudService"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({children}: LayoutProps) => {
  var state = GetAuthenticationStatus()
  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      <Header />
      <HStack
        alignItems="flex-start"
        height="100%"
        pr="20px"
        w="100%"
        width="full"
        as="section"
        mt="65px"
        justify="flex-start"
      >
        <LeftNavigation />
        {children}
      </HStack>
      <Footer />
    </Box>
  )
}

export default Layout
