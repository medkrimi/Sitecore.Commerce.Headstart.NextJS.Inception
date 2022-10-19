import {
  Flex,
  Image,
  Text,
  Link,
  Button,
  Icon,
  IconButton,
  useDisclosure
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

const MobileSideBarMenu = () => {
  return (
    <>
      <Flex
        pos="sticky"
        left="0"
        h="95vh"
        marginTop="5px"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius="15px"
        w="75px"
        ml="0"
        flexDir="column"
        justifyContent="space-between"
        background="brand.500"
        color="white"
      >
        <Flex p="5%" flexDir="column" w="100%" alignItems="center" as="nav">
          <NextLink href="/" passHref>
            <Link pl="2" pr="2" pb="15px" pt="30px">
              <Icon
                as={HiOutlineChartBar}
                fontSize="30px"
                title="Dashboard"
              ></Icon>
            </Link>
          </NextLink>
          <NextLink href="/products" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={HiOutlineQrcode}
                fontSize="30px"
                title="Products"
              ></Icon>
            </Link>
          </NextLink>
          <NextLink href="/promotions" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon as={FiStar} fontSize="30px" title="Promotions"></Icon>
            </Link>
          </NextLink>
          <NextLink href="/orders" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon as={BsCurrencyDollar} fontSize="30px" title="Orders"></Icon>
            </Link>
          </NextLink>
          <NextLink href="/returns" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={HiOutlineEmojiSad}
                fontSize="30px"
                title="Returns"
              ></Icon>
            </Link>
          </NextLink>
          <NextLink href="/users" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon as={HiOutlineUser} fontSize="30px"></Icon>
            </Link>
          </NextLink>
          <NextLink href="/settings" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon as={FiSettings} fontSize="30px" title="Settings"></Icon>
            </Link>
          </NextLink>
        </Flex>
      </Flex>
      <Flex
        justify="center"
        direction="column"
        align="center"
        w="100%"
        width="full"
        pb="30px"
        pt="50px"
      >
        <Image src="/images/SidebarHelpImage.png" w="90px" alt="" />
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          mb="12px"
          me="24px"
          w="100%"
          width="full"
        >
          <Text fontSize="12px" fontWeight="bold">
            Need help?
          </Text>
          <Text fontSize="10px">Please check our docs.</Text>
        </Flex>
        <Link href="#">
          <Button
            size="sm"
            fontWeight="bold"
            minW="185px"
            m="0"
            fontSize="10px"
            color="gray.500"
          >
            Documentation
          </Button>
        </Link>
      </Flex>
    </>
  )
}

export default MobileSideBarMenu
