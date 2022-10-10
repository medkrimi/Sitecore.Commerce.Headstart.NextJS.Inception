import {ChakraProvider, localStorageManager} from "@chakra-ui/react"

import sitecorecommerceTheme from "lib/styles/theme/sitecorecommerce/"
import playsummitTheme from "lib/styles/theme/playsummit/"
import industrialTheme from "lib/styles/theme/industrial/"
import Cookies from "universal-cookie"

interface ChakraProps {
  children: React.ReactNode
}

export const Chakra = ({children}: ChakraProps) => {
  const cookies = new Cookies()
  if (cookies.get("currenttheme") === undefined) {
    cookies.set("currenttheme", "lib/styles/theme/sitecorecommerce/", {
      path: "/"
    })
  }
  if (cookies.get("currenttheme") === "lib/styles/theme/sitecorecommerce/") {
    // currenttheme from "lib/styles/theme/sitecorecommerce/"
  }
  if (cookies.get("currenttheme") === "lib/styles/theme/playsummit/") {
    // currenttheme from "lib/styles/theme/playsummit/"
  }
  if (cookies.get("currenttheme") === "lib/styles/theme/industrial/") {
    // currenttheme from "lib/styles/theme/industrial/"
  }
  return (
    <ChakraProvider
      colorModeManager={localStorageManager}
      theme={sitecorecommerceTheme}
    >
      {children}
    </ChakraProvider>
  )
}
