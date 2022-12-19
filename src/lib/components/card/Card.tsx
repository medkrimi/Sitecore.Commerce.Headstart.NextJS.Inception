import {Box, Flex, IconButton, useStyleConfig} from "@chakra-ui/react"

import {useEffect, useState} from "react"
import {HiOutlineMinusSm, HiOutlinePlusSm} from "react-icons/hi"
function Card(props) {
  const {variant, children, ...rest} = props
  const styles = useStyleConfig("Card", {variant})
  const [isShownPanel, setIsShownPanel] = useState(true)
  const [isShownButton, setIsShownButton] = useState(false)

  useEffect(() => {
    if (props.hideclosebutton !== null) {
      //var showbutton = props.hideclosebutton.toLowerCase()
      if (props.hideclosebutton === true) {
        setIsShownButton(true)
      }
    }
  }, [])

  const handlePanelClick = (event) => {
    // toggle shown state
    setIsShownPanel((current) => !current)
  }

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
      <IconButton
        variant="closePanelButton"
        aria-label="close panel"
        icon={isShownPanel ? <HiOutlineMinusSm /> : <HiOutlinePlusSm />}
        onClick={handlePanelClick}
        //display={isShownButton}
        hidden={isShownButton}
      ></IconButton>
      {isShownPanel && (
        <Flex flexDirection="column" p="10">
          {children}
        </Flex>
      )}
      {isShownPanel == false && <Flex p="5">Panel is closed</Flex>}
    </Box>
  )
}

export default Card
