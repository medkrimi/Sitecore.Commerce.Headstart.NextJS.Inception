import {ChevronDownIcon, SearchIcon} from "@chakra-ui/icons"
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Box,
  SliderMark,
  InputGroup,
  InputLeftElement,
  Select,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  CheckboxGroup,
  Stack,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
  Icon,
  Spacer
} from "@chakra-ui/react"
import {ChangeEvent, useEffect, useRef, useState} from "react"
import {
  FiRotateCcw,
  FiPlus,
  FiList,
  FiGrid,
  FiEdit,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi"
import {Product, Products} from "ordercloud-javascript-sdk"

import {AiOutlineSearch} from "react-icons/ai"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {CalculateEditorialProcess} from "./EditorialProgressBar"
import {NextSeo} from "next-seo"
import ProductGrid from "./ProductGrid"
import ProductList from "./ProductList"
import {ProductListOptions} from "../../services/ordercloud.service"
import {ProductXPs} from "lib/types/ProductXPs"
import Card from "../card/Card"
import {HiOutlineViewGrid, HiOutlineViewList} from "react-icons/hi"

//import Image from "next/image"

interface ProductSearchProps {
  query: string
}

export default function ProductSearch({query}: ProductSearchProps) {
  //const options: ProductListOptions = {}
  //const optionsSearchOn = ["Name", "Description", "ID"]
  const optionsSearchOnID = "ID"
  const optionsSearchType = "ExactPhrasePrefix"
  const [optionsSearch, setOptionsSearch] = useState("")
  const [optionsSortBy, setOptionsSortBy] = useState("name")
  const toast = useToast()
  const [products, setProducts] = useState<Product<ProductXPs>[]>(null)
  const [componentProducts, setComponentProducts] =
    useState<Product<ProductXPs>[]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sliderColor = useColorModeValue("brand.400", "brand.600")
  const [editorialProgressFilter, setEditorialProgressFilter] = useState(100)
  const [sortBy, setSortBy] = useState("name")
  const [sortingChanging, setSortingChanging] = useState(false)
  const [sortDesc, setSortDesc] = useState(false)
  //const [reload, setReload] = useState(false)
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm"
  }
  const [toggleViewMode, setToggleViewMode] = useState(false)

  const [isBulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}
  const requestImportCSV = () => {}

  useEffect(() => {
    async function GetProducts() {
      const options: ProductListOptions = {}
      options.search = optionsSearch
      options.searchOn = ["Name", "Description", "ID"]
      options.searchType = optionsSearchType
      options.sortBy = [optionsSortBy]
      options.pageSize = 100
      var productList = await Products.List<ProductXPs>(options)
      let productItems = productList.Items
      setComponentProducts(productItems)
      setProducts(productItems)
      //setReload(false)
      setIsLoading(false)
    }

    GetProducts()
  }, [optionsSearch, optionsSearchType, optionsSortBy])

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
    //console.log("onSearchClicked")
    setOptionsSortBy("name")
    setSortBy("name")
    setEditorialProgressFilter(100)
    setOptionsSearch(searchQuery)
    //setReload(true)
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
      //setReload(true)
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
    //console.log("onResetSearch")
    setSearchQuery("")
    setOptionsSortBy("name")
    setSortBy("name")
    setMassEditProducts([])
    //setReload(true)
    setEditorialProgressFilter(100)
    setSortDesc(false)
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
      setOptionsSearch(searchQuery)
      //setReload(true)
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
    //console.log(productId)
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

  const onSortByNameClicked = (newVal: string) => {
    setSortingChanging(true)
    if (newVal == "editorialProcess") {
      var tmpComponentProducts = [...componentProducts]
      var newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(a) - CalculateEditorialProcess(b)
      )
      setComponentProducts(newProducts)
    } else if (newVal == "!editorialProcess") {
      var tmpComponentProducts = [...componentProducts]
      var newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(b) - CalculateEditorialProcess(a)
      )
      setComponentProducts(newProducts)
    } else {
      setOptionsSearch(searchQuery)
      //setReload(true)
      if (newVal != "") {
        setOptionsSortBy(newVal)
      }
    }
    setSortBy(newVal)
    setSortDesc(newVal.substring(0, 1) == "!")
    setSortingChanging(false)
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSortByNameClicked(e.target.value)
  }

  const onEditorialProgressFilterChanged = async (e) => {
    var newProducts = products.filter((element) => {
      return CalculateEditorialProcess(element) <= e
    })

    if (optionsSortBy == "editorialProcess") {
      var tmpComponentProducts = [...newProducts]
      newProducts = tmpComponentProducts.sort(
        (a, b) => CalculateEditorialProcess(a) - CalculateEditorialProcess(b)
      )
    } else if (optionsSortBy == "!editorialProcess") {
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
          <NextSeo title="Products List" />

          {isLoading && !sortingChanging ? (
            <BrandedSpinner />
          ) : (
            <>
              <HStack justifyContent="space-between" w="100%" mb={5}>
                <Link onClick={onOpenAddProduct}>
                  <Button variant="primaryButton">New Product</Button>
                </Link>
                <HStack>
                  <Button
                    variant="link"
                    color="gray.500"
                    fontWeight="400"
                    fontSize="10px"
                    marginRight="30px"
                    onClick={onResetSearch}
                  >
                    Reset Search
                  </Button>
                  <Menu>
                    <MenuButton
                      px={4}
                      py={2}
                      transition="all 0.2s"
                      borderRadius="md"
                      borderWidth="1px"
                      _hover={{bg: "gray.400"}}
                      _expanded={{bg: "blue.400"}}
                      _focus={{boxShadow: "outline"}}
                    >
                      Filters <ChevronDownIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <VStack>
                          <HStack
                            width={"full"}
                            justifyContent={"space-between"}
                          >
                            <Box width={"100%"} pt={8} pb={4} pl={6} pr={6}>
                              <Slider
                                borderRight={"solid black"}
                                borderLeft={"solid black"}
                                aria-label="Editorial Progress Filter"
                                defaultValue={100}
                                value={editorialProgressFilter}
                                onChange={(val) =>
                                  setEditorialProgressFilter(val)
                                }
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
                          <Text>Product Status</Text>
                          <CheckboxGroup>
                            <Stack
                              spacing={[1, 3]}
                              direction={["column", "row"]}
                            >
                              <Checkbox value="Completed" defaultChecked>
                                Completed
                              </Checkbox>
                              <Checkbox value="AwaitingApproval" defaultChecked>
                                Awaiting Approval
                              </Checkbox>
                              <Checkbox value="Canceled" defaultChecked>
                                Canceled
                              </Checkbox>
                              <Checkbox value="Declined" defaultChecked>
                                Declined
                              </Checkbox>
                              <Checkbox value="Open" defaultChecked>
                                Open
                              </Checkbox>
                            </Stack>
                          </CheckboxGroup>
                          <Divider />
                          <HStack>
                            {/*<Button size="md" bg={boxBgColor} color={color}>
                      Clear
                    </Button>
                  <Button size="md" bg={boxBgColor} color={color}>
                      Submit
                    </Button> */}

                            <Select
                              onChange={handleSelectChange}
                              w={"60%"}
                              value={
                                sortBy.substring(0, 1) == "!"
                                  ? sortBy.substring(1)
                                  : sortBy
                              }
                            >
                              <option
                                value="name"
                                /* selected={
                              optionsSortBy == "name" ||
                              optionsSortBy == "!name"
                            } */
                              >
                                Name
                              </option>
                              <option
                                value="ID"
                                /* selected={
                              optionsSortBy == "ID" || optionsSortBy == "!ID"
                            } */
                              >
                                Product ID
                              </option>
                              <option
                                value="editorialProcess"
                                /* selected={
                              optionsSortBy == "editorialProcess" ||
                              optionsSortBy == "!editorialProcess"
                            } */
                              >
                                Progress
                              </option>
                              <option
                                value="Active"
                                /* selected={
                              optionsSortBy == "Active" ||
                              optionsSortBy == "!Active"
                            } */
                              >
                                Active
                              </option>
                            </Select>
                            <Tooltip label="Sort Asc/Desc">
                              <IconButton
                                aria-label="Sort Asc/Desc"
                                icon={
                                  sortDesc ? <FiChevronDown /> : <FiChevronUp />
                                }
                                onClick={() => {
                                  setSortDesc(!sortDesc)
                                  sortBy.substring(0, 1) == "!"
                                    ? setSortBy(sortBy.substring(1))
                                    : setSortBy("!" + sortBy)
                                  optionsSortBy.substring(0, 1) == "!"
                                    ? setOptionsSortBy(
                                        optionsSortBy.substring(1)
                                      )
                                    : setOptionsSortBy("!" + optionsSortBy)
                                }}
                                float="right"
                              />
                            </Tooltip>
                          </HStack>
                        </VStack>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Button
                    variant="secondaryButton"
                    onClick={onMassEditOpenClicked}
                  >
                    Bulk Edit
                  </Button>
                  <Button
                    variant="secondaryButton"
                    onClick={() => setBulkImportDialogOpen(true)}
                  >
                    Bulk Import
                  </Button>
                  <Button
                    variant="secondaryButton"
                    onClick={() => setExportCSVDialogOpen(true)}
                  >
                    Export CSV
                  </Button>
                </HStack>
              </HStack>
              <Card showclosebutton="false">
                <HStack justifyContent="space-between">
                  <Text fontWeight={"bold"} p={3} float={"left"}>
                    Total Products: {componentProducts.length}
                  </Text>
                  <Box>
                    <HStack>
                      <Box pb="15px">
                        <Icon
                          aria-label="Grid View"
                          as={HiOutlineViewGrid}
                          onClick={() => setToggleViewMode(false)}
                          fontSize="36px"
                          color="gray.200"
                          cursor="pointer"
                        />
                      </Box>
                      <Box pb="15px">
                        <Icon
                          aria-label="List View"
                          as={HiOutlineViewList}
                          onClick={() => setToggleViewMode(true)}
                          fontSize="36px"
                          color="gray.200"
                          cursor="pointer"
                        />
                      </Box>
                      <Spacer width="20px"></Spacer>
                      <InputGroup width={"450px"} float="right">
                        <InputLeftElement>
                          <AiOutlineSearch />
                        </InputLeftElement>
                        <Input
                          autoComplete="off"
                          placeholder="Enter here ..."
                          aria-label="Enter Search Term"
                          //_placeholder={{color: color}}

                          id={"headerSearchInput"}
                          width={"100%"}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              onSearchClicked()
                            }
                          }}
                        />
                      </InputGroup>
                      {/* <Tooltip label="Search for Products">
                        <IconButton
                          aria-label="Search"
                          icon={<SearchIcon />}
                          onClick={onSearchClicked}
                          float="right"
                        />
                        MOVE THIS TO ENTER BUTTON TO MATCH OTHER AREAS
                      </Tooltip> */}
                    </HStack>
                  </Box>
                </HStack>
                <BrandedTable>
                  {toggleViewMode ? (
                    <ProductList
                      products={componentProducts}
                      onCheckChange={(productid) =>
                        onMassEditCheckboxChanged(productid)
                      }
                      onSort={(columnName) => onSortByNameClicked(columnName)}
                      sortBy={sortBy}
                    />
                  ) : (
                    <ProductGrid
                      products={componentProducts}
                      onCheck={(productid) =>
                        onMassEditCheckboxChanged(productid)
                      }
                    />
                  )}
                </BrandedTable>
                <Box>
                  <Text fontWeight={"bold"} p={3} float={"left"}>
                    {componentProducts.length} out of {componentProducts.length}
                    Products
                  </Text>
                </Box>
              </Card>
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
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Products to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected products to a CSV, once the export button is
                clicked behind the scenes a job will be kicked off to create the
                csv and then will automatically download to your downloads
                folder in the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestExportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Export Orders"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isBulkImportDialogOpen}
        onClose={() => setBulkImportDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Bulk Import Products
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Bulk import products from an excel or csv file, once the upload
                button is clicked behind the scenes a job will be kicked off
                load each of the products included in your files, once it has
                completed you will see them appear in your search.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setBulkImportDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestImportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Import Products"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
