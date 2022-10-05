import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  RadioGroup,
  Stack,
  Radio,
  IconButton,
  useDisclosure
} from "@chakra-ui/react"
import React from "react"
import {HiMenu} from "react-icons/hi"

const MobileNavigation = () => {
  const {isOpen, onOpen, onClose} = useDisclosure()

  return (
    <>
      <Button
        colorScheme="gray.500"
        onClick={onOpen}
        display={{base: "flex", md: "none"}}
      >
        <IconButton icon={<HiMenu />} aria-label="Menu" variant="link" />
      </Button>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MobileNavigation
