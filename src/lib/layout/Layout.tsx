import {Box, HStack} from "@chakra-ui/react"
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
  }, [])

  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {state?.isAnonymous ?? true ? <></> : <Header />}
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
        {state?.isAnonymous ?? true ? <></> : <LeftNavigation />}
        {children}
      </HStack>
      {state?.isAnonymous ?? true ? <></> : <Footer />}
    </Box>
  )
}

export default Layout
