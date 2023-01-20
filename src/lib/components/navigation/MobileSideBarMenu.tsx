import {Button, Flex, Icon, Image, Link, Text} from "@chakra-ui/react"
import {FiSettings, FiStar} from "react-icons/fi"
import {HiOutlineChartBar, HiOutlineEmojiSad, HiOutlineQrcode, HiOutlineUser} from "react-icons/hi"
import React from "react"

import {BsCurrencyDollar} from "react-icons/bs"
import NextLink from "next/link"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

const MobileSideBarMenu = () => {
  return (
    <>
      <Flex
        //pos="sticky"
        left="0"
        h="95vh"
        marginTop="5px"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius="15px"
        w="75px"
        ml="0"
        flexDir="column"
        justifyContent="flex-start"
        background="brand.500"
        color="white"
      >
        <Flex p="5%" flexDir="column" w="100%" alignItems="center" as="nav">
          <NextLink href="/" passHref>
            <Link pl="2" pr="2" pb="15px" pt="30px">
              <Icon as={HiOutlineChartBar} fontSize="30px" title="Dashboard" color="white"></Icon>
            </Link>
          </NextLink>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <NextLink href="/products" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon as={HiOutlineQrcode} fontSize="30px" title="Products" color="white"></Icon>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <NextLink href="/promotions" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon as={FiStar} fontSize="30px" title="Promotions"></Icon>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <NextLink href="/orders" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon as={BsCurrencyDollar} fontSize="30px" title="Orders"></Icon>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <NextLink href="/returns" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon as={HiOutlineEmojiSad} fontSize="30px" title="Returns" color="white"></Icon>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.BuyerManager}>
            <NextLink href="/buyers" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon as={HiOutlineUser} fontSize="30px"></Icon>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <NextLink href="/settings" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon as={FiSettings} fontSize="30px" title="Settings" color="white"></Icon>
              </Link>
            </NextLink>
          </ProtectedContent>
        </Flex>
      </Flex>
    </>
  )
}

export default MobileSideBarMenu
