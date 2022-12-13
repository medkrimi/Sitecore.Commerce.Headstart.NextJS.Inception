export const Input = {
  baseStyle: {
    field: {
      fontWeight: 400,
      borderRadius: "md"
    }
  },

  variants: {
    primaryInput: {
      // Need both root and field for Text Area and Input to style
      bg: "inputBg",
      border: "1px",
      field: {
        bg: "inputBg",
        border: "1px"
      }
    },
    auth: {
      field: {
        bg: "inputBg",
        border: "1px solid",
        borderColor: "gray.200",
        _placeholder: "gray.300"
      }
    },
    search: {
      field: {
        border: "none",
        py: "11px",
        borderRadius: "inherit",
        _placeholder: "gray.300"
      }
    }
  },
  defaultProps: {
    variant: "primaryInput"
  }
}
