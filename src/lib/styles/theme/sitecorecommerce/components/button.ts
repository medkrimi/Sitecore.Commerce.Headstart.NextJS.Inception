export const Button = {
  baseStyle: {
    borderRadius: "10",
    margin: "1px"
  },
  variants: {
    primary: {
      backgroundColor: "brandButtons.500",
      _hover: {
        backgroundColor: "brandButtons.600"
      },
      _dark: {
        backgroundColor: "brandButtons.200",
        _hover: {
          backgroundColor: "brandButtons.100"
        }
      }
    }
  }
}
