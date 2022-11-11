export const Button = {
  baseStyle: {
    borderRadius: "10",
    margin: "1px"
  },
  variants: {
    primary: {
      color: "textColor.900",
      backgroundColor: "brandButtons.500",
      _hover: {
        backgroundColor: "brandButtons.600"
      },
      _dark: {
        color: "textColor.100",
        backgroundColor: "brandButtons.200",
        _hover: {
          backgroundColor: "brandButtons.100"
        }
      }
    }
  }
}
