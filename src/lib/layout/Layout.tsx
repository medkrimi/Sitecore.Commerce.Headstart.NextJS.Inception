import {Box, HStack} from "@chakra-ui/react"
import type {ReactNode} from "react"
import Footer from "./Footer"
import Header from "./Header"
import {FunctionComponent} from "react"
import {useOcDispatch, useOcSelector} from "../redux/ocStore"
import {useEffect} from "react"
import {useRouter} from "next/router"
import LeftNavigation from "lib/components/navigation/SideNavigation"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({children}: LayoutProps) => {
  const {user, isAnonymous, loading, lineItemCount} = useOcSelector((s) => ({
    user: s.ocUser.user,
    loading: s.ocAuth.loading,
    isAnonymous: s.ocAuth.isAnonymous,
    lineItemCount: s.ocCurrentOrder.order
      ? s.ocCurrentOrder.order.LineItemCount
      : 0
  }))

  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {!isAnonymous ? <Header /> : ""}
      <HStack
        alignItems="flex-start"
        height="100%"
        pr="20px"
        w="100%"
        width="full"
        as="section"
      >
        {!isAnonymous ? <LeftNavigation /> : ""}
        {children}
      </HStack>
      {!isAnonymous ? <Footer /> : ""}
    </Box>
  )
}

export default Layout
