import {Box, useStyleConfig, useColorModeValue} from "@chakra-ui/react"
function ClickableTile(props) {
  let tileBg = useColorModeValue("tileBg.500", "tileBg.900")
  const {variant, children, ...rest} = props
  const styles = useStyleConfig("Tile", {variant})
  return (
    <Box bg={tileBg} borderRadius="xl" p="15px" __css={styles} {...rest}>
      {children}
      {children.PageUrl}
    </Box>
  )
}

export default ClickableTile
