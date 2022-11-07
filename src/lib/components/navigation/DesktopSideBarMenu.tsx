import {
  Flex,
  Image,
  Text,
  Link,
  Button,
  Icon,
  IconButton,
  useColorModeValue
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

const DesktopSideBarMenu = () => {
  const [navSize, changeNavSize] = useState("large")
  const sidebarBg = useColorModeValue("brand.500", "brand.600")
  const color = useColorModeValue("textColor.900", "textColor.100")

  return (
    <>
      <Flex
        pos="sticky"
        left="0"
        h="95vh"
        marginTop="5px"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius={navSize == "small" ? "15px" : "30px"}
        w={navSize == "small" ? "75px" : "220px"}
        ml={navSize == "small" ? "0" : "25px"}
        flexDir="column"
        justifyContent="space-between"
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
            icon={<FiMenu fontSize={navSize == "small" ? "30px" : "25px"} />}
            onClick={() => {
              if (navSize == "small") changeNavSize("large")
              else changeNavSize("small")
            }}
          />
          <NextLink href="/" passHref>
            <Link pl="2" pr="2" pb="15px" pt="30px">
              <Icon
                as={HiOutlineChartBar}
                fontSize={navSize == "small" ? "30px" : "25px"}
                title="Dashboard"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
              >
                Dashboard
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/products" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={HiOutlineQrcode}
                fontSize={navSize == "small" ? "30px" : "25px"}
                title="Products"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
              >
                Products
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/promotions" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={FiStar}
                fontSize={navSize == "small" ? "30px" : "25px"}
                title="Promotions"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
              >
                Promotions
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/orders" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={BsCurrencyDollar}
                fontSize={navSize == "small" ? "30px" : "25px"}
                title="Orders"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
              >
                Orders
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/returns" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={HiOutlineEmojiSad}
                fontSize={navSize == "small" ? "30px" : "25px"}
                title="Returns"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
              >
                Returns
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/users" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={HiOutlineUser}
                fontSize={navSize == "small" ? "30px" : "25px"}
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
                title="Buyer"
              >
                Buyers
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/settings" passHref>
            <Link pl="2" pr="2" pb="15px">
              <Icon
                as={FiSettings}
                fontSize={navSize == "small" ? "30px" : "25px"}
                title="Settings"
              ></Icon>
              <Text
                as="span"
                pl="20px"
                hidden={navSize == "small" ? true : false}
              >
                Settings
              </Text>
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
    </>
  )
}

export default DesktopSideBarMenu
