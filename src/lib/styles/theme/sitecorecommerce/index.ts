import {extendTheme} from "@chakra-ui/react"
import {colors} from "./colors"
import {components} from "./components"
import {config} from "./config"
import {fonts} from "./fonts"
import {mode} from "@chakra-ui/theme-tools"
import type {StyleFunctionProps} from "@chakra-ui/styled-system"
// import { layouts } from "./layouts";

const customTheme = extendTheme({
  fonts,
  colors,
  config,
  components,
  // layouts,
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1200px"
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      // styles for the `body`
      body: {
        bg: mode("bodyBg.100", "bodyBg.900")(props),
        color: "white",
        fontSize: "sm"
      }
    })
  }
})

export default customTheme
