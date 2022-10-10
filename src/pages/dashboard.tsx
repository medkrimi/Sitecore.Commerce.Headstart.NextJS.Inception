import {
  Box,
  Flex,
  Heading,
  Text,
  Container,
  SimpleGrid,
  GridItem,
  useColorModeValue,
  Button,
  HStack,
  VStack,
  useColorMode,
  Center,
  Tag,
  Image,
  Link
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
import ClickableTile from "lib/components/generic/card/ClickableTile"
import {HiOutlineBell, HiOutlineCog} from "react-icons/hi"
import CardHeader from "lib/components/generic/card/CardHeader"

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
              columns={{xl: 4, lg: 2, md: 2, sm: 1, base: 1}}
              gap={12}
              mt={4}
              mb={4}
            >
              <GridItem>
                <NextLink href="/products" passHref>
                  <Link>
                    <Box
                      bg="white"
                      borderRadius="xl"
                      p="20px"
                      pt="40px"
                      pb="40px"
                      shadow="xl"
                      w="100%"
                      width="full"
                      _hover={{
                        bg: "gray.200",
                        textDecoration: "none",
                        borderRadius: "10px"
                      }}
                    >
                      <Flex
                        direction="column"
                        mb="20px"
                        ps="22px"
                        alignSelf="flex-start"
                      >
                        <Text fontSize="lg" fontWeight="bold" mb="6px">
                          Sales Overview
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.400"
                        >
                          <Text as="span" color="green.400" fontWeight="bold">
                            (+5%) more
                          </Text>{" "}
                          in 2022
                        </Text>
                      </Flex>
                      <Box
                        w="100%"
                        h={{sm: "300px", xl: "100%"}}
                        ps="8px"
                      ></Box>
                    </Box>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/products" passHref>
                  <Link>
                    <Box
                      bg="white"
                      borderRadius="xl"
                      p="20px"
                      pt="40px"
                      pb="40px"
                      shadow="xl"
                      w="100%"
                      width="full"
                      _hover={{
                        bg: "gray.200",
                        textDecoration: "none",
                        borderRadius: "10px"
                      }}
                    >
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
                    </Box>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/products" passHref>
                  <Link>
                    <Box
                      bg="white"
                      borderRadius="xl"
                      p="20px"
                      pt="40px"
                      pb="40px"
                      shadow="xl"
                      _hover={{
                        bg: "gray.200",
                        textDecoration: "none",
                        borderRadius: "10px"
                      }}
                    >
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
                    </Box>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/users" passHref>
                  <Link>
                    <Box
                      bg="white"
                      borderRadius="xl"
                      p="20px"
                      pt="40px"
                      pb="40px"
                      shadow="xl"
                      _hover={{
                        bg: "gray.200",
                        textDecoration: "none",
                        borderRadius: "10px"
                      }}
                    >
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
                    </Box>
                  </Link>
                </NextLink>
              </GridItem>
              <GridItem>
                <NextLink href="/promotions" passHref>
                  <Link>
                    <Box
                      bg="white"
                      borderRadius="xl"
                      p="20px"
                      pt="40px"
                      pb="40px"
                      shadow="xl"
                      w="100%"
                      width="full"
                      _hover={{
                        bg: "gray.200",
                        textDecoration: "none",
                        borderRadius: "10px"
                      }}
                    >
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
                    </Box>
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
