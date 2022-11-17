import type {StyleFunctionProps} from "@chakra-ui/styled-system"
import {colors} from "./colors"
import {components} from "./components"
import {config} from "./config"
import {extendTheme} from "@chakra-ui/react"
import {fonts} from "./fonts"
import {mode} from "@chakra-ui/theme-tools"
import {MdLabel} from "react-icons/md"
import {getChartByID} from "apexcharts"

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
        color: mode("gray.800", "white")(props),

        fontSize: "sm",

        _dark: {
          color: "textColor.100"
        }
      },
      input: {
        color: "gray.500",
        border: "1px",
        borderColor: "gray.300",
        p: "5px",
        mb: {sm: "20px", lg: "20px"},
        _dark: {
          border: "1px solid",
          borderColor: "gray.300",
          bgColor: "gray.800",
          color: "white"
        }
      }
    })
  }
})

export default customTheme
