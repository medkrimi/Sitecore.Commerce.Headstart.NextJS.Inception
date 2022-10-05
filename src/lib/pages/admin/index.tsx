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
  Tag
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {useRouter} from "next/router"
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

const Admin = () => {
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

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <NextSeo title="Admin" />
      <Heading color={"black"} paddingTop={10} as="h1">
        Please choose below
      </Heading>
      <VStack as="header" width="full" align="center">
        <HStack as="section" w="100%" p="3">
          <Container maxW="container.xl" fontSize="x-small" fontWeight="normal">
            <HStack as="section" w="100%" p="2"></HStack>

            <SimpleGrid
              columns={{xl: 4, lg: 2, md: 2, sm: 1, base: 1}}
              gap={12}
              mt={4}
              mb={4}
            >
              <GridItem
                colSpan={{base: 1, sm: 1, md: 2, lg: 2, xl: 4}}
                _hover={{bg: hoverColor, borderRadius: "10px"}}
              >
                <Button
                  as={"a"}
                  // href={"/Dashboard"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  size="lg"
                  color={color}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  p={8}
                  disabled={true}
                >
                  <Heading size="xl">Dashboard</Heading>
                  <Tag
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    size={"md"}
                    bg={useColorModeValue("brand.500", "brand.700")}
                    ml={2}
                    color={useColorModeValue("textColor.900", "textColor.100")}
                  >
                    COMING SOON
                  </Tag>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  href={"/products"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                >
                  <Box>
                    <Heading size="xl">
                      Products{" "}
                      <Center>
                        <Text as="div">
                          {orderCloudData.Products != null ? (
                            <i>({orderCloudData.Products.length})</i>
                          ) : (
                            <Box pt={2}>
                              <BrandedSpinner />
                            </Box>
                          )}
                        </Text>{" "}
                      </Center>
                    </Heading>
                  </Box>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  href={"/promotions"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  size="lg"
                  color={color}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  p={8}
                >
                  <Heading size="xl">
                    Promotions{" "}
                    <Center>
                      <Text as="div">
                        {orderCloudData.Promotions != null ? (
                          <i>({orderCloudData.Promotions.length})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  // href={"/catalogs"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                  disabled={true}
                >
                  <Heading alignContent={"center"} size="xl">
                    Catalogs
                    <Center>
                      <Text as="div">
                        {orderCloudData.Catalogs != null ? (
                          <i>({orderCloudData.Catalogs.length})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                  <Tag
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    size={"md"}
                    bg={useColorModeValue("brand.500", "brand.700")}
                    ml={2}
                    color={useColorModeValue("textColor.900", "textColor.100")}
                  >
                    COMING SOON
                  </Tag>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  href={"/users"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                >
                  <Heading size="xl">
                    User{" "}
                    <Center>
                      <Text as="div">
                        {orderCloudData.Buyers != -1 ? (
                          <i>({orderCloudData.Buyers})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  // href={"/prices"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                  disabled={true}
                >
                  <Heading size="xl">
                    Prices{" "}
                    <Center>
                      <Text as="div">
                        {orderCloudData.Prices != null ? (
                          <i>({orderCloudData.Prices.length})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                  <Tag
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    size={"md"}
                    bg={useColorModeValue("brand.500", "brand.700")}
                    ml={2}
                    color={useColorModeValue("textColor.900", "textColor.100")}
                  >
                    COMING SOON
                  </Tag>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  // href={"/specs"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                  disabled={true}
                >
                  <Heading size="xl">
                    Specs{" "}
                    <Center>
                      <Text as="div">
                        {orderCloudData.Specs != null ? (
                          <i>({orderCloudData.Specs.length})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                  <Tag
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    size={"md"}
                    bg={useColorModeValue("brand.500", "brand.700")}
                    ml={2}
                    color={useColorModeValue("textColor.900", "textColor.100")}
                  >
                    COMING SOON
                  </Tag>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  // href={"/Supplier"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                  disabled={true}
                >
                  <Heading size="xl">
                    Supplier{" "}
                    <Center>
                      <Text as="div">
                        {orderCloudData.Supplier != null ? (
                          <i>({orderCloudData.Supplier.length})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                  <Tag
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    size={"md"}
                    bg={useColorModeValue("brand.500", "brand.700")}
                    ml={2}
                    color={useColorModeValue("textColor.900", "textColor.100")}
                  >
                    COMING SOON
                  </Tag>
                </Button>
              </GridItem>
              <GridItem _hover={{bg: hoverColor, borderRadius: "10px"}}>
                <Button
                  as={"a"}
                  // href={"/orders"}
                  rounded={10}
                  width={"full"}
                  height={233}
                  _hover={{bg: hoverColor}}
                  _focus={{bg: focusColor}}
                  // colorScheme={colorSheme}
                  boxShadow={shadow}
                  bgGradient={gradient}
                  color={color}
                  size="lg"
                  disabled={true}
                >
                  <Heading size="xl">
                    Orders{" "}
                    <Center>
                      <Text as="div">
                        {orderCloudData.Orders != null ? (
                          <i>({orderCloudData.Orders.length})</i>
                        ) : (
                          <Box pt={2}>
                            <BrandedSpinner />
                          </Box>
                        )}
                      </Text>{" "}
                    </Center>
                  </Heading>
                  <Tag
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    size={"md"}
                    bg={useColorModeValue("brand.500", "brand.700")}
                    ml={2}
                    color={useColorModeValue("textColor.900", "textColor.100")}
                  >
                    COMING SOON
                  </Tag>
                </Button>
              </GridItem>
            </SimpleGrid>
          </Container>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default Admin
