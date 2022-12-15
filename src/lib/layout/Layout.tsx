import {Box, Flex} from "@chakra-ui/react"
import {ReactNode, useEffect, useState} from "react"
import Footer from "./Footer"
import Header from "./Header"
import LeftNavigation from "lib/components/navigation/SideNavigation"
import {useAuth} from "lib/hooks/useAuth"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({children}: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated)
  }, [auth.isAuthenticated])

  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {isAuthenticated && <Header />}
      <Flex
        alignItems="space-between"
        height="100%"
        w="100%"
        width="full"
        as="section"
        mt="89px"
        justify="space-between"
      >
        {isAuthenticated && <LeftNavigation />}
        {children}
      </Flex>
      {isAuthenticated && <Footer />}
    </Box>
  )
}

export default Layout
