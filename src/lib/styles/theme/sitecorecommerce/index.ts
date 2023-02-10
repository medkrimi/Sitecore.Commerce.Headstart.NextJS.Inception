import {Badge} from "./components/badge"
import {Button} from "./components/button"
import {Card} from "./components/card"
import {Button as IconButton} from "./components/button"
import {Input} from "./components/input"
import {Link} from "./components/link"
import {Input as Textarea} from "./components/input"
import {breakpoints} from "./foundations/breakpoints"
import {config} from "./config"
import {extendTheme} from "@chakra-ui/react"
import {fonts} from "./fonts"
import {globalColors} from "./colors"
import {semanticTokens} from "./tokens"
import {styles} from "./styles"

// import { layouts } from "./layouts";

export default extendTheme({
  fonts,
  colors: globalColors,
  config,
  breakpoints, // Breakpoints
  semanticTokens,
  styles,
  components: {
    Card, // Card component
    Link, // Link styles
    Badge, // Badge styles
    Button, // Button styles
    IconButton, // IconButton styles

    Input, // Input styles
    Textarea
  }
})
