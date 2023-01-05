import {
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Text,
  useColorModeValue
} from "@chakra-ui/react"
import {FiSettings, FiStar} from "react-icons/fi"
import {
  HiChevronDoubleLeft,
  HiOutlineChartBar,
  HiOutlineEmojiSad,
  HiOutlineQrcode,
  HiOutlineUser
} from "react-icons/hi"
import React, {useState} from "react"

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
      <Flex
        //pos="sticky"
        left="0"
        h="95vh"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius={navSize == "small" ? "15px" : "30px"}
        w={navSize == "small" ? "75px" : "220px"}
        ml={navSize == "small" ? "0" : "20px"}
        mt={navSize == "small" ? "10px" : "20px"}
        flexDir="column"
        justifyContent="flex-start"
        background={sidebarBg}
        color={color}
      >
        <Flex
          p="5%"
          flexDir="column"
          w="100%"
          alignItems={navSize == "small" ? "center" : "flex-start"}
          as="nav"
        >
          <IconButton
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
          />
          <NextLink href="/" passHref>
            <Link pl="2" pr="2" pb="15px" pt="30px">
              <Icon
                as={HiOutlineChartBar}
                fontSize={navSize == "small" ? "30px" : "35px"}
                title="Dashboard"
                color="white"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
                color="white"
                fontSize={navSize == "small" ? "16px" : "21px"}
              >
                Dashboard
              </Text>
            </Link>
          </NextLink>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <NextLink href="/products" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon
                  as={HiOutlineQrcode}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  title="Products"
                  color="white"
                ></Icon>
                <Text
                  as="span"
                  pl="20px"
                  hidden={navSize == "small" ? true : false}
                  color="white"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                >
                  Products
                </Text>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <NextLink href="/promotions" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon
                  as={FiStar}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  title="Promotions"
                  color="white"
                ></Icon>
                <Text
                  as="span"
                  pl="20px"
                  hidden={navSize == "small" ? true : false}
                  color="white"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                >
                  Promotions
                </Text>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <NextLink href="/orders" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon
                  as={BsCurrencyDollar}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  title="Orders"
                  color="white"
                ></Icon>
                <Text
                  as="span"
                  pl="20px"
                  hidden={navSize == "small" ? true : false}
                  color="white"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                >
                  Orders
                </Text>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <NextLink href="/returns" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon
                  as={HiOutlineEmojiSad}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  title="Returns"
                  color="white"
                ></Icon>
                <Text
                  as="span"
                  pl="20px"
                  hidden={navSize == "small" ? true : false}
                  color="white"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                >
                  Returns
                </Text>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.BuyerManager}>
            <NextLink href="/buyers" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon
                  as={HiOutlineUser}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  color="white"
                ></Icon>
                <Text
                  as="span"
                  pl="20px"
                  hidden={navSize == "small" ? true : false}
                  title="Buyers"
                  color="white"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                >
                  Buyers
                </Text>
              </Link>
            </NextLink>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <NextLink href="/settings" passHref>
              <Link pl="2" pr="2" pb="15px">
                <Icon
                  as={FiSettings}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  title="Settings"
                  color="white"
                ></Icon>
                <Text
                  as="span"
                  pl="20px"
                  hidden={navSize == "small" ? true : false}
                  color="white"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                >
                  Settings
                </Text>
              </Link>
            </NextLink>
          </ProtectedContent>
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
              variant="tertiaryButton"
              size="sm"
              fontWeight="bold"
              minW="185px"
              m="0"
              fontSize="10px"
            >
              Documentation
            </Button>
          </Link>
        </Flex>
      </Flex>
    </>
  )
}

export default DesktopSideBarMenu
