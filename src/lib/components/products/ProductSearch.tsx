import {CheckIcon, CloseIcon, Search2Icon, SearchIcon} from "@chakra-ui/icons"
import {
  Text,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Image,
  HStack,
  Icon,
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
  SliderMark,
  InputGroup,
  InputLeftElement,
  Select
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {AiOutlineSearch} from "react-icons/ai"
import {
  FiRotateCcw,
  FiPlus,
  FiList,
  FiCheckSquare,
  FiArrowDown,
  FiArrowUp,
  FiArrowRight,
  FiGrid,
  FiEdit,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {useState, ChangeEvent, useEffect} from "react"
import {Product, Products} from "ordercloud-javascript-sdk"
import {ProductXPs} from "lib/types/ProductXPs"
import {CalculateEditorialProcess} from "./EditorialProgressBar"
import ProductGrid from "./ProductGrid"
import ProductList from "./ProductList"
import {ProductListOptions} from "lib/scripts/OrdercloudService"
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

  useEffect(() => {
    async function GetProducts() {
      const options: ProductListOptions = {}
      options.search = optionsSearch
      options.searchOn = ["Name", "Description", "ID"]
      options.searchType = optionsSearchType
      options.sortBy = [optionsSortBy]
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
    console.log("onSearchClicked")
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
    console.log("onResetSearch")
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
    console.log(productId)
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
          <NextSeo title="Products Overview" />
          <Heading as="h1">Products Overview</Heading>
          <HStack width={"full"} justifyContent={"space-between"}>
            <Box width={"100%"} pt={8} pb={4} pl={6} pr={6}>
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
                    <Th colSpan={7}>
                      <Tooltip label="Search for Products">
                        <IconButton
                          aria-label="Search"
                          icon={<SearchIcon />}
                          onClick={onSearchClicked}
                          float="right"
                          variant="primary"
                        />
                      </Tooltip>
                      <Tooltip label="Reset Search Parameters">
                        <IconButton
                          aria-label="Reset all Search Parameters"
                          icon={<FiRotateCcw />}
                          onClick={onResetSearch}
                          float="right"
                          variant="primary"
                        />
                      </Tooltip>
                      <Tooltip label="Add new Product">
                        <IconButton
                          aria-label="Add new Product"
                          icon={<FiPlus />}
                          onClick={onOpenAddProduct}
                          float="right"
                          variant="primary"
                        />
                      </Tooltip>
                      <Tooltip label="Mass Edit Products">
                        <IconButton
                          aria-label="Mass Edit Products"
                          icon={<FiEdit />}
                          onClick={onMassEditOpenClicked}
                          float="right"
                          variant="primary"
                        />
                      </Tooltip>
                      <Tooltip label="Switch List/Grid View">
                        <IconButton
                          aria-label="Switch List/Grid View"
                          icon={toggleViewMode ? <FiGrid /> : <FiList />}
                          onClick={() => setToggleViewMode(!toggleViewMode)}
                          float="right"
                          variant="primary"
                        />
                      </Tooltip>
                      <InputGroup width={"450px"} float="right">
                        <InputLeftElement>
                          <AiOutlineSearch />
                        </InputLeftElement>
                        <Input
                          autoComplete="off"
                          placeholder="Enter here ..."
                          aria-label="Enter Search Term"
                          //_placeholder={{color: color}}
                          variant="primary"
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
                                ? setOptionsSortBy(optionsSortBy.substring(1))
                                : setOptionsSortBy("!" + optionsSortBy)
                            }}
                            float="right"
                            variant="primary"
                          />
                        </Tooltip>
                      </InputGroup>
                    </Th>
                  </Tr>
                </Thead>
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
