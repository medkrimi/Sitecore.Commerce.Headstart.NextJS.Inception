import {
  Container,
  HStack,
  VStack,
  Divider,
  Box,
  Flex,
  Image,
  Text,
  Link,
  Button,
  Icon,
  IconButton,
  useMediaQuery
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import NextLink from "next/link"
import {
  HiOutlineChartBar,
  HiOutlineEmojiSad,
  HiOutlineQrcode,
  HiOutlineUser
} from "react-icons/hi"
import {FiStar, FiSettings, FiMenu} from "react-icons/fi"
import {BsCurrencyDollar} from "react-icons/bs"
import MobileSideBarMenu from "./MobileSideBarMenu"
import DesktopSideBarMenu from "./DesktopSideBarMenu"

const SideNavigation = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  return (
    <VStack justifyContent="flex-start">
      {isMobile ? <MobileSideBarMenu /> : <DesktopSideBarMenu />}
    </VStack>
  )
}

export default SideNavigation
