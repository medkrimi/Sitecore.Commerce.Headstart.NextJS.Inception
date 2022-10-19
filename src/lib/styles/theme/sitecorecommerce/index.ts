import {extendTheme} from "@chakra-ui/react"

import {colors} from "./colors"
import {components} from "./components"
import {config} from "./config"
import {fonts} from "./fonts"
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
  }
})

export default customTheme
