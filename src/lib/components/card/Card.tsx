import {Box, useStyleConfig} from "@chakra-ui/react"
function Card(props) {
  const {variant, children, ...rest} = props
  const styles = useStyleConfig("Card", {variant})
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p="15px"
      __css={styles}
      {...rest}
      pt="40px"
      pb="40px"
      shadow="xl"
      w="100%"
      width="full"
      position="relative"
      _hover={{
        bg: "gray.200",
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      {children}
    </Box>
  )
}

export default Card
