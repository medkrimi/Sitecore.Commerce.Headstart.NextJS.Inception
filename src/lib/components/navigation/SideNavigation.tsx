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
  Icon
} from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import {HiOutlineChartBar, HiOutlineEmojiSad, HiOutlineQrcode, HiOutlineUser} from "react-icons/hi"
import {FiStar, FiSettings, FiMenu} from "react-icons/fi"
import {BsCurrencyDollar} from "react-icons/bs"

const SideNavigation = () => {
  return (
    <VStack
      as="section"
      width="full"
      align="center"
      maxW="250px"
      m="20px"
      mt="0px"
    >
      <HStack
        as="section"
        w="100%"
        p="4"
        bgColor="brand.500"
        borderRadius="xl"
        shadow="xl"
      >
        <Container color="white" fontSize="md" fontWeight="normal">
          <VStack justifyContent="space-between">
            <VStack width="full" align="left">
              <NextLink href="/" passHref>
                <Link pl="2" pr="2" pb="15px" pt="30px">
                  <Icon as={HiOutlineChartBar}></Icon>
                  <Text as="span" pl="20px">
                    Dashboard
                  </Text>
                </Link>
              </NextLink>
              <NextLink href="/products" passHref>
                <Link pl="2" pr="2" pb="15px">
                  <Icon as={HiOutlineQrcode}></Icon>
                  <Text as="span" pl="20px">
                    Products
                  </Text>
                </Link>
              </NextLink>
              <NextLink href="/promotions" passHref>
                <Link pl="2" pr="2" pb="15px">
                  <Icon as={FiStar}></Icon>
                  <Text as="span" pl="20px">
                    Promotions
                  </Text>
                </Link>
              </NextLink>
              <NextLink href="/orders" passHref>
                <Link pl="2" pr="2" pb="15px">
                  <Icon as={BsCurrencyDollar}></Icon>
                  <Text as="span" pl="20px">
                    Orders
                  </Text>
                </Link>
              </NextLink>
              <NextLink href="/returns" passHref>
                <Link pl="2" pr="2" pb="15px">
                  <Icon as={HiOutlineEmojiSad}></Icon>
                  <Text as="span" pl="20px">
                    Returns
                  </Text>
                </Link>
              </NextLink>
              <NextLink href="/users" passHref>
                <Link pl="2" pr="2" pb="15px">
                  <Icon as={HiOutlineUser}></Icon>
                  <Text as="span" pl="20px">
                    Buyers
                  </Text>
                </Link>
              </NextLink>
              <NextLink href="/settings" passHref>
                <Link pl="2" pr="2" pb="15px">
                  <Icon as={FiSettings}></Icon>
                  <Text as="span" pl="20px">
                    Settings
                  </Text>
                </Link>
              </NextLink>
            </VStack>
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
          </VStack>
        </Container>
      </HStack>
    </VStack>
  )
}

export default SideNavigation
