import {
  Menu,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Flex,
  useColorModeValue,
  Icon,
  Avatar,
  Link,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Tooltip,
  useColorMode,
  Select
} from "@chakra-ui/react"
import NextLink from "next/link"
import {BsSun, BsMoonStarsFill} from "react-icons/bs"
import logout from "../../redux/ocAuth/logout"
import {useOcDispatch, useOcSelector} from "../../redux/ocStore"
import {Me, RequiredDeep} from "ordercloud-javascript-sdk"

import {HiOutlineBell, HiOutlineCog} from "react-icons/hi"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {ItemContent} from "../generic/ItemContent"
import React, {useState} from "react"
import Cookies from "universal-cookie"

const MobileNavigation = () => {
  let menuBg = useColorModeValue("white", "navy.800")
  const dispatch = useOcDispatch()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const btnRef = React.useRef()
  const {colorMode, toggleColorMode} = useColorMode()
  const [selectedOption, setSelectedOption] = useState<String>()

  // This function is triggered when the select changes
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedOption(value)
    const cookies = new Cookies()
    cookies.set("currenttheme", value, {
      path: "/"
    })
    //Reload page so the theme takes affect
    window.location.reload()
  }
  return (
    <HStack>
      <Menu>
        <MenuButton>
          <Icon as={HiOutlineBell} />
        </MenuButton>
        <MenuList p="16px 8px" bg={menuBg}>
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 minutes ago"
                info="from Alicia"
                boldInfo="New Message"
                aName="Alicia"
                aSrc="/images/avatars/avatar1.png"
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 days ago"
                info="by Josh Henry"
                boldInfo="New Album"
                aName="Josh Henry"
                aSrc="/images/avatars/avatar2.png"
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 days ago"
                info="Payment succesfully completed!"
                boldInfo=""
                aName="Kara"
                aSrc="/images/avatars/avatar3.png"
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton>
          <HStack>
            <Avatar
              name="Chris Janning"
              src="/images/avatars/avatar1.png"
              borderRadius="50%"
              mr="10px"
              ml="30px"
              size="sm"
            />
            <Text fontSize="12px">Chris Janning</Text>
            <ChevronDownIcon ml="10px" />
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem>
            <NextLink href="#" passHref>
              <Link pl="2" pr="2">
                Manage Profile
              </Link>
            </NextLink>
          </MenuItem>
          <MenuItem>
            <NextLink href="#" passHref>
              <Link pl="2" pr="2">
                Notifications
              </Link>
            </NextLink>
          </MenuItem>
          <MenuItem>
            <NextLink href="/logoff" passHref>
              <Link pl="2" pr="2" onClick={() => dispatch(logout())}>
                Log out
              </Link>
            </NextLink>
          </MenuItem>
        </MenuList>
      </Menu>
      <Button ref={btnRef} onClick={onOpen} variant="unstyled">
        <Icon as={HiOutlineCog} />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Application Settings</DrawerHeader>

          <DrawerBody>
            <Tooltip
              label={
                colorMode === "dark" ? "Set Light Model" : "Set Dark Model"
              }
            >
              <Button
                colorScheme="purple"
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                _focus={{boxShadow: "none"}}
                size={"md"}
                w="fit-content"
              >
                {colorMode === "light" ? <BsMoonStarsFill /> : <BsSun />}
              </Button>
            </Tooltip>
            <Text mt="20">Change Theme:</Text>
            <Select id="ThemeDropdown" onChange={selectChange}>
              <option value="lib/styles/theme/sitecorecommerce/">
                Sitecore Commerce
              </option>
              <option value="lib/styles/theme/playsummit/">Play Summit</option>
              <option value="lib/styles/theme/industrial/">Industrial</option>
            </Select>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  )
}

export default MobileNavigation
