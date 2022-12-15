import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Flex,
  HStack,
  StackDivider,
  VStack
} from "@chakra-ui/react"
import {
  GetAuthenticationStatus,
  OcAuthState
} from "../../lib/services/ordercloud.service"
import {ReactNode, useEffect, useState} from "react"

import Footer from "./Footer"
import Header from "./Header"
import ContentHeader from "./ContentHeader"
import ContentFooter from "./ContentFooter"
import LeftNavigation from "lib/components/navigation/SideNavigation"

type LayoutProps = {
  children: ReactNode
  title: string
}

const Layout = ({children, title}: LayoutProps) => {
  const [state, setState] = useState<OcAuthState>()

  useEffect(() => {
    setState(GetAuthenticationStatus())
  }, [children])

  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {state?.isAnonymous ?? true ? <></> : <Header />}
      <Flex
        alignItems="flex-start"
        height="100%"
        w="100%"
        width="full"
        as="section"
        mt="89px"
        justify="space-between"
      >
        {state?.isAnonymous ?? true ? <></> : <LeftNavigation />}
        <Container maxW="full">
          <ContentHeader title={title} />
          {children}
          <ContentFooter />
        </Container>
      </Flex>
      {state?.isAnonymous ?? true ? <></> : <Footer />}
    </Box>
  )
}

export default Layout
