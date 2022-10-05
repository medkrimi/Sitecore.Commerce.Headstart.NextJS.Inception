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
  components
  // layouts,
})

export default customTheme
