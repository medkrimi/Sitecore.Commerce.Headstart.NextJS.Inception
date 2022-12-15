import {Box, useStyleConfig} from "@chakra-ui/react"
function Card(props) {
  const {variant, children, ...rest} = props
  const styles = useStyleConfig("Card", {variant})
  return (
    <Box
      bg="white"
      borderRadius="xl"
      __css={styles}
      {...rest}
      pt="2"
      pb="2"
      mb="6"
      shadow="xl"
      w="100%"
      width="full"
      position="relative"
      _hover={{
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      {children}
    </Box>
  )
}

export default Card
