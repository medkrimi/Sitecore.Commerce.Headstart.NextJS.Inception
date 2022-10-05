import {Box, Container} from "@chakra-ui/react"
import type {ReactNode} from "react"
import Footer from "./Footer"
import Header from "./Header"
import {useOcDispatch, useOcSelector} from "../redux/ocStore"
import {useRouter} from "next/router"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({children}: LayoutProps) => {
  const dispatch = useOcDispatch()

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
      {children}
    </Box>
  )
}

export default Layout
