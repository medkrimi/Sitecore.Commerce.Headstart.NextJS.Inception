import {mode} from "@chakra-ui/theme-tools"
export const inputStyles = {
  components: {
    Input: {
      baseStyle: {
        field: {
          fontWeight: 400,
          borderRadius: "md"
        }
      },

      variants: {
        primaryInput: {
          border: "1px",
          bg: "#000"
        },
        auth: (props) => ({
          field: {
            bg: mode("white", "navy.700")(props),
            border: "1px solid",
            borderColor: mode("gray.200", "transparent")(props),
            _placeholder: {color: mode("gray.300", "gray.400")(props)}
          }
        }),
        search: (props) => ({
          field: {
            border: "none",
            py: "11px",
            borderRadius: "inherit",
            _placeholder: {color: mode("gray.300", "gray.400")(props)}
          }
        })
      },
      defaultProps: {
        variant: "primaryInput"
      }
    }
  }
}
