import {mode} from "@chakra-ui/theme-tools"

export const globalStyles = {
  styles: {
    global: (props) => ({
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
}
