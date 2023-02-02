import {Button, Flex, Icon, IconButton, Image, Link, Text, useColorModeValue} from "@chakra-ui/react"
import {FiSettings, FiStar} from "react-icons/fi"
import {
  HiChevronDoubleLeft,
  HiOutlineChartBar,
  HiOutlineEmojiSad,
  HiOutlineQrcode,
  HiOutlineUser,
  HiOutlineUserGroup
} from "react-icons/hi"
import React, {useState} from "react"
import {TbBuildingWarehouse, TbShoppingCartDiscount, TbShoppingCartPlus, TbTruckReturn} from "react-icons/tb"

import {BsCurrencyDollar} from "react-icons/bs"
import NextLink from "next/link"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

const DesktopSideBarMenu = () => {
  const [navSize, changeNavSize] = useState("large")
  const sidebarBg = useColorModeValue("brand.500", "brand.600")
  const color = useColorModeValue("textColor.900", "textColor.100")

  return (
    <>
      <Flex //pos="fixed" ml="10"
      >
        <Flex
          //pos="sticky"
          left="0"
          //h="95vh"
          boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
          borderRadius={navSize == "small" ? "15px" : "30px"}
          w={navSize == "small" ? "75px" : "250px"}
          ml={navSize == "small" ? "0" : "20px"}
          mt={navSize == "small" ? "10px" : "20px"}
          flexDir="column"
          justifyContent="flex-start"
          background={sidebarBg}
          color={color}
        >
          <Flex p="5%" flexDir="column" w="100%" alignItems={navSize == "small" ? "center" : "flex-start"} as="nav">
            {/* <IconButton
            aria-label="Change menu"
            background="none"
            mt={5}
            _hover={{background: "none"}}
            icon={
              <HiChevronDoubleLeft
                fontSize={navSize == "small" ? "30px" : "35px"}
              />
            }
            onClick={() => {
              if (navSize == "small") changeNavSize("large")
              else changeNavSize("small")
            }}
          /> */}
            <NextLink href="/" passHref>
              <Link
                pl="2"
                pr="2"
                pb="15px"
                pt="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={HiOutlineChartBar} fontSize={navSize == "small" ? "30px" : "35px"} title="Dashboard"></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Dashboard
                </Text>
              </Link>
            </NextLink>
            <ProtectedContent hasAccess={appPermissions.ProductManager}>
              <NextLink href="/products" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon as={HiOutlineQrcode} fontSize={navSize == "small" ? "30px" : "35px"} title="Products"></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Products
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.ProductManager}>
              <NextLink href="/promotions" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon
                    as={TbShoppingCartDiscount}
                    fontSize={navSize == "small" ? "30px" : "35px"}
                    title="Promotions"
                  ></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Promotions
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.OrderManager}>
              <NextLink href="/orders" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon as={TbShoppingCartPlus} fontSize={navSize == "small" ? "30px" : "35px"} title="Orders"></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Orders
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.OrderManager}>
              <NextLink href="/returns" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon as={TbTruckReturn} fontSize={navSize == "small" ? "30px" : "35px"} title="Returns"></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Returns
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.BuyerManager}>
              <NextLink href="/buyers" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon as={HiOutlineUserGroup} fontSize={navSize == "small" ? "30px" : "35px"}></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    title="Buyers"
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Buyers
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.SupplierManager}>
              <NextLink href="/suppliers" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon as={TbBuildingWarehouse} fontSize={navSize == "small" ? "30px" : "35px"}></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    title="Suppliers"
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Suppliers
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.MeManager}>
              <NextLink href="/settings" passHref>
                <Link
                  pl="2"
                  pr="2"
                  pb="15px"
                  verticalAlign="middle"
                  display="flex"
                  color="white"
                  _hover={{color: "gray.300"}}
                >
                  <Icon as={FiSettings} fontSize={navSize == "small" ? "30px" : "35px"} title="Settings"></Icon>
                  <Text
                    as="span"
                    pl="GlobalPadding"
                    hidden={navSize == "small" ? true : false}
                    fontSize={navSize == "small" ? "16px" : "21px"}
                    pt="2px"
                  >
                    Settings
                  </Text>
                </Link>
              </NextLink>
            </ProtectedContent>
          </Flex>
        </Flex>{" "}
      </Flex>
    </>
  )
}

export default DesktopSideBarMenu
