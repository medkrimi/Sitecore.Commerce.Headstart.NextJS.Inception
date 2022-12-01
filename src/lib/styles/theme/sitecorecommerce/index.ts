import {extendTheme} from "@chakra-ui/react"
import type {StyleFunctionProps} from "@chakra-ui/styled-system"
import {globalColors} from "./colors"
import {config} from "./config"
import {fonts} from "./fonts"
import {mode} from "@chakra-ui/theme-tools"

import {globalStyles} from "./styles"
import {breakpoints} from "./foundations/breakpoints"
import {buttonStyles} from "./components/button"
import {badgeStyles} from "./components/badge"
import {linkStyles} from "./components/link"
import {inputStyles} from "./components/input"
import {cardStyles} from "./components/card"

import {MdLabel} from "react-icons/md"
import {getChartByID} from "apexcharts"
import {NodeNextRequest} from "next/dist/server/base-http/node"

// import { layouts } from "./layouts";

export default extendTheme(
  fonts,
  globalColors,
  config,
  buttonStyles, // Button styles
  badgeStyles, // Badge styles
  linkStyles, // Link styles
  inputStyles, // Input styles
  cardStyles, // Card component
  breakpoints, // Breakpoints
  globalStyles
)
