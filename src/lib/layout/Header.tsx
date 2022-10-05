import {
  Container,
  HStack,
  VStack,
  useColorMode,
  Button,
  InputGroup,
  useColorModeValue,
  Select,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  DrawerContent,
  DrawerHeader,
  Box,
  Heading,
  ListItem,
  UnorderedList
} from "@chakra-ui/react"
import HeaderLogo from "lib/components/branding/HeaderLogo"
import logout from "../redux/ocAuth/logout"
import {useOcDispatch, useOcSelector} from "../redux/ocStore"
import {FiLogOut} from "react-icons/fi"
import {BsSun, BsMoonStarsFill} from "react-icons/bs"
import {AiOutlineSearch} from "react-icons/ai"
import {VscAccount} from "react-icons/vsc"
import {useRouter} from "next/router"
import {Input} from "@chakra-ui/react"
import {useState} from "react"
import {
  Product,
  Products,
  Promotion,
  Promotions
} from "ordercloud-javascript-sdk"
import {OcProductListOptions, setListOptions} from "lib/redux/ocProductList"

const Header = () => {
  const dispatch = useOcDispatch()
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue("headerBg.400", "headerBg.600")
  const color = useColorModeValue("textColor.900", "textColor.100")
  const {push} = useRouter()
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("products")
  const [autoCompleteProducts, setAutoCompleteProducts] =
    useState<Product<any>[]>(null)
  const [autoCompletePromotions, setAutoCompletePromotions] =
    useState<Promotion[]>(null)

  const onLogout = () => {
    dispatch(logout())
    push("/")
  }

  const onSearchExecuted = () => {
    setShowSearch(false)
    setAutoCompleteProducts(null)
    const currentQuery = query
    setQuery("")

    const options: OcProductListOptions = {}
    options.search = currentQuery
    options.searchOn = ["Name", "Description", "ID"]
    options.searchType = "ExactPhrasePrefix"
    dispatch(setListOptions(options))
    push(
      {
        pathname: "/" + category,
        query: {query: currentQuery}
      },
      "/" + category
    )
  }

  const onQueryChanged = async (e) => {
    e.preventDefault()
    const newQuery = e.target.value
    setQuery(newQuery)
    if (category == "products" && newQuery != "") {
      const products = await Products.List({
        search: newQuery,
        searchOn: ["Name", "ID", "Description"],
        searchType: "ExactPhrasePrefix"
      })
      setAutoCompleteProducts(products.Items)
      setAutoCompletePromotions(null)
    } else if (category == "promotions" && newQuery != "") {
      const promotions = await Promotions.List({
        search: newQuery,
        searchOn: ["Name", "ID", "Description", "Code"]
      })
      setAutoCompleteProducts(null)
      setAutoCompletePromotions(promotions.Items)
    } else {
      setAutoCompleteProducts(null)
    }
  }

  const onAutocompleteClicked = (e) => {
    e.preventDefault()
    setShowSearch(false)
    setAutoCompleteProducts(null)
    setQuery("")

    const targetId = e.currentTarget.dataset.id
    push("/" + category + "/" + targetId)
  }

  return (
    <VStack
      as="header"
      width="full"
      align="center"
      backgroundColor={bg}
      color={color}
    >
      <HStack as="section" w="100%" p="2" maxHeight="100">
        <Container maxW="container.xl" fontSize="x-small" fontWeight="normal">
          <HStack justifyContent="space-between">
            <HeaderLogo />
            <HStack justifyContent="flex-end" color={color}>
              <Tooltip label="Search">
                <Button
                  colorScheme="purple"
                  size={"md"}
                  aria-label="Search"
                  onClick={() => {
                    setShowSearch(!showSearch)
                  }}
                >
                  <AiOutlineSearch />
                </Button>
              </Tooltip>
              <Tooltip
                label={
                  colorMode === "dark" ? "Set Light Model" : "Set Dark Model"
                }
              >
                <Button
                  colorScheme="purple"
                  aria-label="Toggle Color Mode"
                  onClick={toggleColorMode}
                  _focus={{boxShadow: "none"}}
                  size={"md"}
                  w="fit-content"
                >
                  {colorMode === "light" ? <BsMoonStarsFill /> : <BsSun />}
                </Button>
              </Tooltip>
              <Tooltip label="Account Settings">
                <Button
                  colorScheme="purple"
                  size={"md"}
                  aria-label="Account Settings"
                >
                  <VscAccount />
                </Button>
              </Tooltip>

              <Tooltip label="Logout">
                <Button
                  colorScheme="purple"
                  size={"md"}
                  aria-label="Logout"
                  onClick={onLogout}
                >
                  <FiLogOut />
                </Button>
              </Tooltip>
            </HStack>
          </HStack>
        </Container>
      </HStack>
      <Drawer
        size={"lg"}
        placement={"top"}
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      >
        <DrawerOverlay color={color} bg={bg} />
        <DrawerContent>
          <DrawerCloseButton size={"lg"} />
          <DrawerHeader alignContent={"center"}>Global Search</DrawerHeader>

          <DrawerBody>
            <InputGroup>
              {/* <InputRightElement children={<AiOutlineSearch fill={"black"} />} /> */}
              <Input
                autoComplete="off"
                placeholder="Enter your search term here ..."
                _placeholder={{color: color}}
                aria-label="Enter Search Term"
                width={"80%"}
                // bg={bg}
                // color={color}
                _hover={{borderColor: color}}
                id={"headerSearchInput"}
                onChange={onQueryChanged}
                value={query}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSearchExecuted()
                  }
                }}
              />

              <Select
                id={"headerSearchDropdown"}
                width={"20%"}
                color={color}
                aria-label="Choose Category"
                _hover={{borderColor: color}}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option aria-label="Products" value="products">
                  Products
                </option>
                <option aria-label="Promotions" value="promotions">
                  Promotions
                </option>
                <option aria-label="Catalogs" value="catalogs" disabled={true}>
                  Catalogs
                </option>
              </Select>
            </InputGroup>
          </DrawerBody>

          <DrawerFooter>
            <Button width={"full"} onClick={onSearchExecuted}>
              Execute
            </Button>
          </DrawerFooter>
          {autoCompleteProducts != null ? (
            <Box pl={6} pt={4}>
              <Heading size="md">Autocomplete...</Heading>
            </Box>
          ) : (
            <></>
          )}

          <Box pl={6} pt={2} pb={4}>
            <UnorderedList>
              {autoCompleteProducts &&
                autoCompleteProducts.map((product, index) => {
                  return (
                    <ListItem
                      data-id={product.ID}
                      onClick={onAutocompleteClicked}
                      key={index}
                      cursor={"copy"}
                    >
                      {product.ID} | {product.Name}
                    </ListItem>
                  )
                })}
              {autoCompletePromotions &&
                autoCompletePromotions.map((promotion, index) => {
                  return (
                    <ListItem
                      data-id={promotion.ID}
                      onClick={onAutocompleteClicked}
                      key={index}
                      cursor={"copy"}
                    >
                      {promotion.ID} | {promotion.Name}
                    </ListItem>
                  )
                })}
            </UnorderedList>
          </Box>
        </DrawerContent>
      </Drawer>
    </VStack>
  )
}

export default Header
