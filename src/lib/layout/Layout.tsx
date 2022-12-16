import {Box, Container, Flex} from "@chakra-ui/react"
import {ReactNode, useEffect, useState} from "react"
import Footer from "./Footer"
import Header from "./Header"
import ContentHeader from "./ContentHeader"
import ContentFooter from "./ContentFooter"
import LeftNavigation from "lib/components/navigation/SideNavigation"
import {useAuth} from "lib/hooks/useAuth"

type LayoutProps = {
  children: ReactNode
  title: string
}

const Layout = ({children, title}: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated)
  }, [auth.isAuthenticated])

  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {isAuthenticated && <Header />}
      <Flex
        alignItems="flex-start"
        height="100%"
        w="100%"
        width="full"
        as="section"
        mt="89px"
        justify="space-between"
      >
        {isAuthenticated && <LeftNavigation />}
        <Container maxW="full">
          <ContentHeader title={title} />
          {children}
          <ContentFooter />
        </Container>
      </Flex>
      {isAuthenticated && <Footer />}
    </Box>
  )
}

export default Layout
