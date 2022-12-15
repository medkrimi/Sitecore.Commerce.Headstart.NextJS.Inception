import {AuthContext} from "lib/context/auth-context"
import {useRouter} from "next/router"
import React from "react"

export const ProtectRoute = ({children}: any) => {
  const router = useRouter()
  const {isAuthenticated} = React.useContext(AuthContext)
  const isLoginPage = () => router.pathname === "/"

  // can only use router on the browser
  if (typeof window !== "undefined") {
    if (!isAuthenticated && !isLoginPage()) {
      router.push("/")
    } else if (isAuthenticated && isLoginPage()) {
      router.push("/dashboard")
    }
  }

  return children
}
