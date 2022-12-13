import {Box, HStack, Flex} from "@chakra-ui/react"
import {ReactNode, useEffect, useState} from "react"
import Footer from "./Footer"
import Header from "./Header"
import LeftNavigation from "lib/components/navigation/SideNavigation"
import {
  GetAuthenticationStatus,
  OcAuthState
} from "lib/scripts/OrdercloudService"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({children}: LayoutProps) => {
  const [state, setState] = useState<OcAuthState>()

  useEffect(() => {
    setState(GetAuthenticationStatus())
  }, [children])

  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {state?.isAnonymous ?? true ? <></> : <Header />}
      <Flex
        alignItems="space-between"
        height="100%"
        w="100%"
        width="full"
        as="section"
        mt="89px"
        justify="space-between"
      >
        {state?.isAnonymous ?? true ? <></> : <LeftNavigation />}
        {children}
      </Flex>
      {state?.isAnonymous ?? true ? <></> : <Footer />}
    </Box>
  )
}

export default Layout
