/* eslint-disable react/jsx-no-undef */
import {
  Box,
  Flex,
  Heading,
  Text,
  Container,
  SimpleGrid,
  GridItem,
  useColorModeValue,
  HStack,
  VStack,
  useColorMode,
  Image,
  Link,
  Icon
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {useRouter} from "next/router"
import NextLink from "next/link"
import {useEffect, useState} from "react"
import {
  Buyers,
  Catalogs,
  Orders,
  PriceSchedules,
  Products,
  Promotions,
  Specs,
  Suppliers,
  Users
} from "ordercloud-javascript-sdk"
import {useOcSelector} from "lib/redux/ocStore"
import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import AverageOrderAmount from "lib/components/analytics/AverageOrderAmount"
import TodaysMoney from "lib/components/analytics/PercentChangeTile"
import TodaysUsers from "lib/components/analytics/PercentChangeTile"
import NewClients from "lib/components/analytics/PercentChangeTile"
import TotalSales from "lib/components/analytics/PercentChangeTile"
import formatShortPrice from "lib/utils/formatShortPrice"
import {
  HiOutlineCurrencyDollar,
  HiOutlineFolderOpen,
  HiOutlineUserAdd,
  HiOutlineUserCircle
} from "react-icons/hi"
import Card from "lib/components/card/Card"

const Dashboard = () => {
  const {push} = useRouter()
  // const options: OcProductListOptions = {}
  // const dispatch = useOcDispatch()
  // const products = useOcProductList(options)
  const {colorMode, toggleColorMode} = useColorMode()
  const [orderCloudData, setOrdercloudData] = useState({
    Products: null,
    Catalogs: null,
    Promotions: null,
    Buyers: -1,
    Prices: null,
    Specs: null,
    Supplier: null,
    Orders: null
  })

  const {isAnonymous} = useOcSelector((s) => ({
    isAnonymous: s.ocAuth.isAnonymous
  }))

  useEffect(() => {
    if (isAnonymous) {
      push("/")
    }

    // Can be refactored to use Redux as well like with products
    async function LoadOrdercloudData() {
      if (!isAnonymous) {
        var products = await Products.List()
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var promotions = await Promotions.List()
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var prices = await PriceSchedules.List()
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var catalogs = await Catalogs.List()
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var specs = await Specs.List()
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var supplier = await Suppliers.List()
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var orders = await Orders.List("All")
          .then((response) => {
            return response.Items
          })
          .catch((error) => {
            console.log(error)
          })
        var buyers = await Buyers.List()
          .then(async (response) => {
            var sumBuyerSeller = 0
            await Promise.all(
              response.Items.map(async (element, key) => {
                var buserSeller = await Users.List(element.ID)
                sumBuyerSeller += buserSeller.Items.length
              })
            )
            return sumBuyerSeller
          })
          .catch((error) => {
            console.log(error)
          })

        setOrdercloudData((v) => ({
          ...v,
          ["Products"]: products,
          ["Promotions"]: promotions,
          ["Prices"]: prices,
          ["Catalogs"]: catalogs,
          ["Specs"]: specs,
          ["Supplier"]: supplier,
          ["Orders"]: orders,
          ["Buyers"]: buyers as number
        }))
      }
    }

    LoadOrdercloudData()

    // dispatch(setListOptions(options))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnonymous])

  const shadow = "5px 5px 5px #999999"
  const gradient =
    colorMode === "light"
      ? "linear(to-t, brand.300, brand.400)"
      : "linear(to-t, brand.600, brand.500)"
  const hoverColor = useColorModeValue("brand.300", "brand.400")
  const focusColor = useColorModeValue("brand.300", "brand.400")
  const colorSheme = "gray"
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")
  const tileBg = useColorModeValue("tileBg.500", "tileBg.900")

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
      width="100%"
    >
      <NextSeo title="Dashboard" />
      <VStack as="header" width="full" align="center">
        <HStack as="section" w="100%" p="3">
          <Container maxW="full" fontSize="x-small" fontWeight="normal">
            <HStack as="section" w="100%" p="2"></HStack>

            <SimpleGrid
              columns={{xl: 2, lg: 2, md: 1, sm: 1, base: 1}}
              gap={{xl: 12, lg: 8, md: 4, sm: 2, base: 2}}
              mt={4}
              mb={4}
            >
              <GridItem>
                <HStack w="full" width="100%">
                  <Box
                    w="full"
                    width="100%"
                    pr={{xl: 6, lg: 6, md: 3, sm: 2, base: 2}}
                  >
                    <NextLink href="#" passHref>
                      <Link>
                        <TodaysMoney
                          title="todays money"
                          totalamount={` ${formatShortPrice(53897)}`}
                          percentchange="3.48"
                          percentchangetype="pos"
                          percentlabel="Since last month"
                          icon={<Icon as={HiOutlineFolderOpen} />}
                        />
                      </Link>
                    </NextLink>
                  </Box>
                  <Box
                    w="full"
                    width="100%"
                    pl={{xl: 6, lg: 6, md: 3, sm: 2, base: 2}}
                  >
                    <NextLink href="#" passHref>
                      <Link>
                        <TodaysUsers
                          title="todays users"
                          totalamount={` ${formatShortPrice(3200)}`}
                          percentchange="5.2"
                          percentchangetype="pos"
                          percentlabel="Since last month"
                          icon={<Icon as={HiOutlineUserCircle} />}
                        />
                      </Link>
                    </NextLink>
                  </Box>
                </HStack>
                <HStack w="full" width="100%" pt={12} pb={12}>
                  <Box
                    w="full"
                    width="100%"
                    pr={{xl: 6, lg: 6, md: 3, sm: 2, base: 2}}
                  >
                    <NextLink href="#" passHref>
                      <Link>
                        <NewClients
                          title="new clients"
                          totalamount={` ${formatShortPrice(2503)}`}
                          percentchange="2.82"
                          percentchangetype="pos"
                          percentlabel="Since last month"
                          icon={<Icon as={HiOutlineUserAdd} />}
                        />
                      </Link>
                    </NextLink>
                  </Box>
                  <Box
                    w="full"
                    width="100%"
                    pl={{xl: 6, lg: 6, md: 3, sm: 2, base: 2}}
                  >
                    <NextLink href="#" passHref>
                      <Link>
                        <TotalSales
                          title="total sales"
                          totalamount={` ${formatShortPrice(173000)}`}
                          percentchange="8.12"
                          percentchangetype="pos"
                          percentlabel="Compared to last year"
                          icon={<Icon as={HiOutlineCurrencyDollar} />}
                        />
                      </Link>
                    </NextLink>
                  </Box>
                </HStack>
              </GridItem>
              <GridItem pb={12}>
                <NextLink href="#" passHref>
                  <Link>
                    <AverageOrderAmount />
                  </Link>
                </NextLink>
              </GridItem>
            </SimpleGrid>
            <SimpleGrid
              columns={{xl: 4, lg: 2, md: 2, sm: 1, base: 1}}
              gap={{xl: 12, lg: 8, md: 4, sm: 2, base: 2}}
              mt={4}
              mb={4}
            >
              <GridItem>
                <NextLink href="/products" passHref>
                  <Link>
                    <Card p="28px 10px 0px 0px" mb={{sm: "26px", lg: "0px"}}>
                      <HStack
                        justifyContent="space-around"
                        w="100%"
                        width="full"
                      >
                        <Heading size="md">
                          Products
                          <Text as="span" pl="8px">
                            {orderCloudData.Products != null ? (
                              <i>({orderCloudData.Products.length})</i>
                            ) : (
                              <Box pt={2}>
                                <BrandedSpinner />
                              </Box>
                            )}
                          </Text>
                        </Heading>
                        <Image
                          src="/images/icon_product.png"
                          alt="Icon Products"
                        />
                      </HStack>
                    </Card>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/products" passHref>
                  <Link>
                    <Card p="28px 10px 0px 0px" mb={{sm: "26px", lg: "0px"}}>
                      <HStack
                        justifyContent="space-around"
                        w="100%"
                        width="full"
                      >
                        <Heading size="md">
                          Orders
                          <Text as="span" pl="8px">
                            {orderCloudData.Orders != null ? (
                              <i>({orderCloudData.Orders.length})</i>
                            ) : (
                              <Box pt={2}>
                                <BrandedSpinner />
                              </Box>
                            )}
                          </Text>
                        </Heading>
                        <Image src="/images/icon_order.png" alt="Icon Orders" />
                      </HStack>
                    </Card>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/users" passHref>
                  <Link>
                    <Card p="28px 10px 0px 0px" mb={{sm: "26px", lg: "0px"}}>
                      <HStack
                        justifyContent="space-around"
                        w="100%"
                        width="full"
                      >
                        <Heading size="md">
                          Users
                          <Text as="span" pl="8px">
                            {orderCloudData.Buyers != -1 ? (
                              <i>({orderCloudData.Buyers})</i>
                            ) : (
                              <Box pt={2}>
                                <BrandedSpinner />
                              </Box>
                            )}
                          </Text>
                        </Heading>
                        <Image src="/images/icon_user.png" alt="Icon Users" />
                      </HStack>
                    </Card>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/promotions" passHref>
                  <Link>
                    <Card p="28px 10px 0px 0px" mb={{sm: "26px", lg: "0px"}}>
                      <HStack
                        justifyContent="space-around"
                        w="100%"
                        width="full"
                      >
                        <Heading size="md">
                          Promotions
                          <Text as="span" pl="8px">
                            {orderCloudData.Promotions != null ? (
                              <i>({orderCloudData.Promotions.length})</i>
                            ) : (
                              <Box pt={2}>
                                <BrandedSpinner />
                              </Box>
                            )}
                          </Text>
                        </Heading>
                        <Image
                          src="/images/icon_promo.png"
                          alt="Icon Promotions"
                        />
                      </HStack>
                    </Card>
                  </Link>
                </NextLink>
              </GridItem>
            </SimpleGrid>
          </Container>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default Dashboard
