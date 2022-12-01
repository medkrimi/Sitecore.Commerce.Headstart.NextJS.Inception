import {mode} from "@chakra-ui/theme-tools"
export const buttonStyles = {
  // The styles all button have in common
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "full"
      },
      // Three sizes: sm, md and lg
      sizes: {
        sm: {
          fontSize: "sm",
          px: 4, // <-- px is short for paddingLeft and paddingRight
          py: 3 // <-- py is short for paddingTop and paddingBottom
        },
        md: {
          fontSize: "md",
          px: 6, // <-- these values are tokens from the design system
          py: 4 // <-- these values are tokens from the design system
        },
        lg: {
          fontSize: "lg",
          px: 8, // <-- these values are tokens from the design system
          py: 6 // <-- these values are tokens from the design system
        }
      },
      // Three Variants are identified : Primary, Secondary and Tertiary
      variants: {
        primaryButton: {
          color: "white",
          bgColor: "black",
          borderRadius: "md",
          fontSize: "12px",
          fontWeight: "normal",
          _dark: {
            border: "1px solid",
            borderColor: "gray.300",
            bgColor: "gray.800",
            color: "white"
          }
        },
        secondaryButton: {
          border: "1px solid",
          borderColor: "gray.300",
          bgColor: "white",
          color: "black",
          borderRadius: "md",
          fontSize: "12px",
          fontWeight: "normal",
          _dark: {
            border: "1px solid",
            borderColor: "gray.300",
            bgColor: "gray.800",
            color: "white"
          }
        },
        tertiaryButton: {
          border: "1px solid",
          borderColor: "gray.300",
          bgColor: "white",
          color: "black",
          borderRadius: "md",
          fontSize: "12px",
          fontWeight: "normal",
          _dark: {
            border: "1px solid",
            borderColor: "gray.300",
            bgColor: "gray.800",
            color: "white"
          }
        },
        closePanelButton: {
          bg: "gray.200",
          color: "white",
          borderRadius: "50%",
          position: "absolute",
          right: "20px",
          top: "20px"
        }
      },
      // The default size and variant values
      defaultProps: {
        size: "md",
        variant: "primaryButton"
      }
    }
  }
}
