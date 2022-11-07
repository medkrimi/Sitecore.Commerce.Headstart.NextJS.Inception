import type {DeepPartial, Theme} from "@chakra-ui/react"

export const Input = {
  baseStyle: {
    //borderRadius: "full"
  },
  variants: {
    primary: {
      field: {
        backgroundColor: "inputBg.100",
        _hover: {
          backgroundColor: "inputBg.200"
        },
        _dark: {
          backgroundColor: "inputBg.900",
          _hover: {
            backgroundColor: "inputBg.800"
          }
        }
      }
    }
  }
}
