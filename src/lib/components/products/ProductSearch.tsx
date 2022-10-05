import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Text,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Box,
  SliderMark
} from "@chakra-ui/react"
import {OcProductListOptions, setListOptions} from "lib/redux/ocProductList"
import {NextSeo} from "next-seo"
import {AiOutlineSearch} from "react-icons/ai"
import {
  FiRotateCcw,
  FiPlus,
  FiList,
  FiCheckSquare,
  FiArrowDown,
  FiArrowUp,
  FiArrowRight
} from "react-icons/fi"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import NextLink from "next/link"
import useOcProductList from "lib/hooks/useOcProductList"
import {useOcDispatch, useOcSelector} from "lib/redux/ocStore"
import {useState, ChangeEvent, useEffect} from "react"
import {Product, Products} from "ordercloud-javascript-sdk"
import {ProductXPs} from "lib/types/ProductXPs"
import {CalculateEditorialProcess} from "./EditorialProgressBar"

interface ProductSearchProps {
  query: string
}

export default function ProductSearch({query}: ProductSearchProps) {
  const options: OcProductListOptions = {}
  const toast = useToast()
  let products = useOcProductList(options)
  const [componentProducts, setComponentProducts] =
    useState<Product<ProductXPs>[]>(products)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const bg = useColorModeValue("gray.400", "gray.600")
  const color = useColorModeValue("textColor.900", "textColor.100")
  const sliderColor = useColorModeValue("brand.400", "brand.600")
  const [editorialProgressFilter, setEditorialProgressFilter] = useState(100)
  const [sortBy, setSortBy] = useState("")
  const [sortingChanging, setSortingChanging] = useState(false)

  const dispatch = useOcDispatch()

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm"
  }

  useEffect(() => {
    if (query) {
      setSearchQuery(query)
    }

    setComponentProducts(products)
  }, [products, query])

  const {isLoading} = useOcSelector((s) => ({
    isLoading: s.ocProductList.loading
  }))

  const [searchQuery, setSearchQuery] = useState(query)
  const [selectAllProducts, setSelectAllProducts] = useState(false)
  const {
    isOpen: isOpenAddProduct,
    onOpen: onOpenAddProduct,
    onClose: onCloseAddProduct
  } = useDisclosure()
  const {
    isOpen: isOpenMassEditProducts,
    onOpen: onOpenMassEditProducts,
    onClose: onCloseMassEditProducts
  } = useDisclosure()
  const [isAdding, setIsAdding] = useState(false)
  const [isMassEditing, setIsMassEditing] = useState(false)
  const [massEditProducts, setMassEditProducts] = useState<
    Product<ProductXPs>[]
  >([])
  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    description: "",
    isActive: false,
    isInactive: false
  })

  const onSearchClicked = async () => {
    setSortBy("")
    setEditorialProgressFilter(100)
    options.search = searchQuery
    options.searchOn = ["Name", "Description", "ID"]
    options.searchType = "ExactPhrasePrefix"
    await dispatch(setListOptions(options))
  }

  // TODO Add more properties in Add handling
  const onProductAdd = async (e) => {
    if (formValues.id == "" || formValues.name == "") {
      toast({
        title: "Missing Properties",
        description: "Please fill out ID and NAME to add the product",
        status: "error",
        duration: 9000,
        isClosable: true
      })
      return
    }

    setIsAdding(true)
    e.preventDefault()
    const newProduct: Product = {
      Name: formValues.name,
      Description: formValues.description,
      ID: formValues.id,
      Active: formValues.isActive
    }
    await Products.Create(newProduct)

    setFormValues((v) => ({
      ...v,
      ["isActive"]: false,
      ["isInactive"]: false,
      ["name"]: "",
      ["id"]: "",
      ["description"]: ""
    }))

    setTimeout(() => {
      onCloseAddProduct()
      dispatch(setListOptions(options))
      setIsAdding(false)
    }, 5000)
  }

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
    }

  const handleCheckboxChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      if (fieldKey == "isActive" && formValues["isInactive"]) {
        setFormValues((v) => ({...v, ["isInactive"]: false}))
      } else if (fieldKey == "isInactive" && formValues["isActive"]) {
        setFormValues((v) => ({...v, ["isActive"]: false}))
      }
      setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
    }

  const onResetSearch = (e) => {
    setSearchQuery("")
    setSortBy("")
    setMassEditProducts([])
    dispatch(setListOptions(options))
    setEditorialProgressFilter(100)
  }

  const onExecuteMassEdit = async () => {
    setIsMassEditing(true)
    var activate = formValues.isActive
    var deactivate = formValues.isInactive
    var newActivationStatus = activate ? true : deactivate ? false : null
    if (newActivationStatus == null) {
      toast({
        title: "No Activation Status set",
        description: "Please choose at least 1 activation status",
        status: "error",
        duration: 9000,
        isClosable: true
      })
      setIsMassEditing(false)
      return
    }

    await Promise.all(
      massEditProducts.map(async (element) => {
        var editedProduct: Product = {
          Name: element.Name,
          Active: newActivationStatus
        }

        await Products.Patch(element.ID, editedProduct)
      })
    )

    setTimeout(() => {
      options.search = searchQuery
      options.searchOn = ["Name", "Description", "ID"]
      dispatch(setListOptions(options))
      setIsMassEditing(false)
      setMassEditProducts([])
      onCloseMassEditProducts()
      setFormValues((v) => ({
        ...v,
        ["isActive"]: false,
        ["isInactive"]: false,
        ["name"]: "",
        ["id"]: "",
        ["description"]: ""
      }))
      setEditorialProgressFilter(100)
    }, 5000)
  }

  const onMassEditCheckboxChanged = (productId: string) => (e) => {
    var product = componentProducts.find((element) => element.ID == productId)
    var isChecked = e.target.checked
    var productsToEdit = massEditProducts
    if (isChecked) {
      productsToEdit.push(product)
      setMassEditProducts(productsToEdit)
    } else {
      var newProductsToEdit = productsToEdit.splice(
        productsToEdit.findIndex((element) => element.ID != productId),
        1
      )
      setMassEditProducts(newProductsToEdit)
    }
  }

  const onMassEditOpenClicked = async (e) => {
    if (massEditProducts.length == 0) {
      toast({
        title: "No Products selected",
        description: "Please select at least 1 Product for mass editing",
        status: "error",
        duration: 9000,
        isClosable: true
      })
    } else {
      onOpenMassEditProducts()
    }
  }

  const onSortByNameClicked = (newVal: string) => async (e) => {
    setSortingChanging(true)
    setSortBy(newVal)

    if (newVal == "editorialProgress") {
      var tmpComponentProducts = [...componentProducts]
      var newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(a) - CalculateEditorialProcess(b)
      )
      setComponentProducts(newProducts)
    } else if (newVal == "!editorialProgress") {
      var tmpComponentProducts = [...componentProducts]
      var newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(b) - CalculateEditorialProcess(a)
      )
      setComponentProducts(newProducts)
    } else {
      options.search = searchQuery
      options.searchOn = ["Name", "Description", "ID"]
      options.searchType = "ExactPhrasePrefix"
      if (newVal != "") {
        options.sortBy = [newVal]
      }
      await dispatch(setListOptions(options))
    }

    setSortingChanging(false)
  }

  const onEditorialProgressFilterChanged = async (e) => {
    var newProducts = products.filter((element) => {
      return CalculateEditorialProcess(element) <= e
    })

    if (sortBy == "editorialProgress") {
      var tmpComponentProducts = [...newProducts]
      newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(a) - CalculateEditorialProcess(b)
      )
    } else if (sortBy == "!editorialProgress") {
      var tmpComponentProducts = [...newProducts]
      newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(b) - CalculateEditorialProcess(a)
      )
    }

    setComponentProducts(newProducts)
  }

  return (
    <>
      {componentProducts ? (
        <VStack p={0} spacing={6} width="full" align="center">
          <NextSeo title="Products Overview" />
          <Heading color={"black"} as="h1">
            Products Overview
          </Heading>
          <HStack
            width={{
              base: "100%",
              sm: "100%",
              lg: "70%",
              md: "100%"
            }}
            justifyContent="space-between"
          >
            <Input
              autoComplete="off"
              placeholder="Enter here ..."
              aria-label="Enter Search Term"
              bg={bg}
              color={color}
              _placeholder={{color: color}}
              id={"headerSearchInput"}
              width={"full"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSearchClicked()
                }
              }}
            />
            <Tooltip label="Search for Products">
              <IconButton
                aria-label="Search"
                icon={<AiOutlineSearch />}
                colorScheme={"purple"}
                onClick={onSearchClicked}
              />
            </Tooltip>
            <Tooltip label="Reset Search Parameters">
              <IconButton
                aria-label="Reset all Search Parameters"
                icon={<FiRotateCcw />}
                colorScheme={"purple"}
                onClick={onResetSearch}
              />
            </Tooltip>
            <Tooltip label="Add new Product">
              <IconButton
                aria-label="Add new Product"
                icon={<FiPlus />}
                colorScheme={"purple"}
                onClick={onOpenAddProduct}
              />
            </Tooltip>
            <Tooltip label="Mass Edit Products">
              <IconButton
                aria-label="Mass Edit Products"
                icon={<FiList />}
                colorScheme={"purple"}
                onClick={onMassEditOpenClicked}
              />
            </Tooltip>
          </HStack>
          <HStack width={"full"} justifyContent={"space-between"}>
            <Box color={"black"} width={"100%"} pt={8} pb={4} pl={6} pr={6}>
              <Slider
                borderRight={"solid black"}
                borderLeft={"solid black"}
                aria-label="Editorial Progress Filter"
                defaultValue={100}
                value={editorialProgressFilter}
                onChange={(val) => setEditorialProgressFilter(val)}
                onChangeEnd={onEditorialProgressFilterChanged}
                min={0}
                max={100}
                step={1}
              >
                <SliderMark value={0} {...labelStyles}>
                  0%
                </SliderMark>
                <SliderMark value={25} {...labelStyles}>
                  25%
                </SliderMark>
                <SliderMark value={50} {...labelStyles}>
                  50%
                </SliderMark>
                <SliderMark value={75} {...labelStyles}>
                  75%
                </SliderMark>
                <SliderMark value={100} {...labelStyles}>
                  100%
                </SliderMark>
                <SliderMark
                  value={editorialProgressFilter}
                  textAlign="center"
                  bg={sliderColor}
                  color="white"
                  mt="-10"
                  ml="-5"
                  w="12"
                >
                  {editorialProgressFilter}%
                </SliderMark>
                <SliderTrack bg={"lightgray"}>
                  <SliderFilledTrack bg={sliderColor} />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Text fontWeight={"bold"} pt={5} ml={-2}>
                Filter by Editorial Progress...
              </Text>
            </Box>
          </HStack>

          {isLoading && !sortingChanging ? (
            <BrandedSpinner />
          ) : (
            <>
              <BrandedTable>
                <Thead>
                  <Tr>
                    <Tooltip
                      label={"Click here to select / unselect all Products"}
                    >
                      <Th cursor={"pointer"}>
                        <Flex justifyContent={"flex-start"}>
                          <FiCheckSquare />
                          <Text ml={2}>Mass Edit</Text>
                        </Flex>
                      </Th>
                    </Tooltip>
                    <Th>Product ID</Th>

                    <Th>
                      <Tooltip label="Sort by Name">
                        <Flex justifyContent={"flex-start"}>
                          {sortBy == "name" ? (
                            <FiArrowUp
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("!name")}
                            />
                          ) : sortBy == "!name" ? (
                            <FiArrowDown
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("name")}
                            />
                          ) : (
                            <FiArrowRight
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("name")}
                            />
                          )}

                          <Text ml={2}>Product Name</Text>
                        </Flex>
                      </Tooltip>
                    </Th>

                    {/* <Th color={color}>Description</Th> */}
                    <Th>
                      {" "}
                      <Tooltip label="Sort by Is Active">
                        <Flex justifyContent={"flex-start"}>
                          {sortBy == "Active" ? (
                            <FiArrowUp
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("!Active")}
                            />
                          ) : sortBy == "!Active" ? (
                            <FiArrowDown
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("Active")}
                            />
                          ) : (
                            <FiArrowRight
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("Active")}
                            />
                          )}

                          <Text ml={2}>Active?</Text>
                        </Flex>
                      </Tooltip>
                    </Th>
                    <Th>
                      {" "}
                      <Tooltip label="Sort by Editorial Progress">
                        <Flex justifyContent={"flex-start"}>
                          {sortBy == "editorialProgress" ? (
                            <FiArrowUp
                              cursor={"editorialProgress"}
                              onClick={onSortByNameClicked(
                                "!editorialProgress"
                              )}
                            />
                          ) : sortBy == "!editorialProgress" ? (
                            <FiArrowDown
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("editorialProgress")}
                            />
                          ) : (
                            <FiArrowRight
                              cursor={"pointer"}
                              onClick={onSortByNameClicked("editorialProgress")}
                            />
                          )}

                          <Text ml={2}>Editorial Progress</Text>
                        </Flex>
                      </Tooltip>
                    </Th>
                    <Th>Detail Page</Th>
                  </Tr>
                </Thead>
                <Tbody alignContent={"center"}>
                  {componentProducts && componentProducts.length > 0 ? (
                    componentProducts.map((product, index) => (
                      <Tr key={index}>
                        <Td>
                          <Checkbox
                            onChange={onMassEditCheckboxChanged(product.ID)}
                          />
                        </Td>
                        <Td>{product.ID}</Td>
                        <Td>{product.Name}</Td>
                        {/* <Td>{product.Description}</Td> */}
                        <Td>
                          {product.Active ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Td>
                        <Td>{CalculateEditorialProcess(product)}%</Td>
                        <Td>
                          <NextLink href={"/products/" + product.ID} passHref>
                            <Link>Open Product</Link>
                          </NextLink>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Text p={3}>No Products found</Text>
                  )}
                </Tbody>
              </BrandedTable>
              <Box>
                <Text fontWeight={"bold"} p={3} float={"left"} color={"black"}>
                  {componentProducts.length} out of {componentProducts.length}{" "}
                  Products{" "}
                </Text>
              </Box>
            </>
          )}
        </VStack>
      ) : (
        <BrandedSpinner />
      )}

      <Modal isOpen={isOpenAddProduct} onClose={onCloseAddProduct}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          {isAdding ? (
            <ModalHeader textAlign={"center"}>
              Adding... <BrandedSpinner />
            </ModalHeader>
          ) : (
            <>
              <ModalHeader>Add a new Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>ID*</FormLabel>
                  <Input
                    autoComplete="off"
                    placeholder="123456"
                    value={formValues.id}
                    onChange={handleInputChange("id")}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Name*</FormLabel>
                  <Input
                    autoComplete="off"
                    placeholder="New Product"
                    value={formValues.name}
                    onChange={handleInputChange("name")}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    autoComplete="off"
                    placeholder="Lorem Ipsum Dolor..."
                    value={formValues.description}
                    onChange={handleInputChange("description")}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Is Active</FormLabel>
                  <Checkbox
                    value={formValues.isActive ? 1 : 0}
                    onChange={handleCheckboxChange("setIsActive")}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="purple" mr={3} onClick={onProductAdd}>
                  Add
                </Button>
                <Button onClick={onCloseAddProduct}>Abort</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenMassEditProducts} onClose={onCloseMassEditProducts}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          {isMassEditing ? (
            <ModalHeader textAlign={"center"}>
              MassEditing... <BrandedSpinner />
            </ModalHeader>
          ) : (
            <>
              <ModalHeader>Mass Edit Products</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Text>
                  You have selected {massEditProducts.length} Products
                </Text>
                <FormControl mt={4}>
                  <FormLabel>Activate</FormLabel>
                  <Checkbox
                    isChecked={formValues.isActive}
                    onChange={handleCheckboxChange("isActive")}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Deactivate</FormLabel>
                  <Checkbox
                    isChecked={formValues.isInactive}
                    onChange={handleCheckboxChange("isInactive")}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="purple" mr={3} onClick={onExecuteMassEdit}>
                  Edit
                </Button>
                <Button onClick={onCloseMassEditProducts}>Abort</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
