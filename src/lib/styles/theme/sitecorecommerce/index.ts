import type {StyleFunctionProps} from "@chakra-ui/styled-system"
import {colors} from "./colors"
import {components} from "./components"
import {config} from "./config"
import {extendTheme} from "@chakra-ui/react"
import {fonts} from "./fonts"
import {mode} from "@chakra-ui/theme-tools"

// import { layouts } from "./layouts";

const customTheme = extendTheme({
  semanticTokens: {
    colors: {
      error: "red.500",
      text: {
        default: "gray.900",
        _dark: "gray.50"
      },
      gridCellBg: {
        default: "boxBgColor.200",
        _dark: "boxBgColor.600"
      }
    }
  },
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
        color: mode("gray.800", "white")(props),
        fontSize: "sm",
        _dark: {
          color: "textColor.100"
        }
      }
    })
  }
})

export default customTheme
