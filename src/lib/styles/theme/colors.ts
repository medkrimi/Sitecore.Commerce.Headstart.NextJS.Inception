import type {DeepPartial, Theme} from "@chakra-ui/react"

/** extend additional color here */
const extendedColors: DeepPartial<
  Record<string, Theme["colors"]["blackAlpha"]>
> = {
  brand: {
    // 100: "#197BBD",
    // 200: "#197BBD",
    // 300: "#197BBD",
    // 400: "#125E8A",
    // 500: "#125E8A",
    // 600: "#125E8A",
    // 700: "#204B57",
    // 800: "#204B57",
    // 900: "#204B57"
    // Teal
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795",
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044"
  },
  boxTextColor: {
    100: "white",
    900: "black"
  },
  textColor: {
    100: "white",
    900: "black"
  },
  okColor: {
    200: "#9AE6B4",
    800: "#22543D"
  },
  errorColor: {
    200: "#FEB2B2",
    800: "#822727"
  },
  headerBg: {
    400: "#A0AEC0",
    600: "#4A5568"
  },
  footerBg: {
    400: "#A0AEC0",
    600: "#4A5568"
  }
}

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {}

export const colors = {
  ...overridenChakraColors,
  ...extendedColors
}
