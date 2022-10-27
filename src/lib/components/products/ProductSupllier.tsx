import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  useColorModeValue,
  Heading,
  Box,
  Button,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Collapse,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Checkbox,
  useDisclosure,
  Input,
  FormControl,
  Text,
  ListItem,
  UnorderedList,
  Tag
} from "@chakra-ui/react"
import {setProductId} from "lib/redux/ocProductDetail"
import {useOcDispatch} from "lib/redux/ocStore"
import {
  ListPage,
  Product,
  Products,
  ProductSupplier,
  RequiredDeep,
  Spec,
  SpecProductAssignment,
  Specs,
  Supplier
} from "ordercloud-javascript-sdk"
import React, {useEffect} from "react"
import {useState} from "react"
import {FiPlus, FiTrash2} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"

type ProductDataProps = {
  product: RequiredDeep<Product<any>>
}

export default function ProductSuppliers({product}: ProductDataProps) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const bg = useColorModeValue("brand.500", "brand.500")
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [supplier, setSupplier] = useState<ProductSupplier[]>(null)

  useEffect(() => {
    async function GetProdcutSupplier() {
      if (product) {
        var productSupplier = await Products.ListSuppliers(product.ID)
        setSupplier(productSupplier.Items)
      }
    }
    GetProdcutSupplier()
  }, [product])

  // const dispatch = useOcDispatch()
  // const {isOpen, onOpen, onClose} = useDisclosure()
  // const cancelRef = React.useRef()
  // const [newSpecifaction, setNewSpecification] = useState("")
  // const [isLinking, setIsLinking] = useState(false)
  // const [availableSpecs, setAvailableSpecs] = useState<Spec<any, any>[]>(null)
  // const [isSpecChosen, setIsSpecChosen] = useState(false)

  // const onRemoveSpecification = async (e) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   const specId = e.currentTarget.dataset.id
  //   await Specs.DeleteProductAssignment(specId, product.ID)

  //   var targetSpec = specs.find((innerSpec) => innerSpec.ID == specId)
  //   if (targetSpec.DefinesVariant) {
  //     // TODO: ASK in Dialog if Variants shall be regenerated and how?
  //     // In case a variant spec has been deleted, all the variants have to be regenerated
  //     await Products.GenerateVariants(product.ID, {overwriteExisting: true})
  //   }

  //   await dispatch(setProductId(product.ID))
  //   setIsLoading(false)
  // }

  // const onSpecificationLink = async (e) => {
  //   setIsLinking(true)
  //   e.preventDefault()
  //   const specProductAssignment: SpecProductAssignment = {
  //     ProductID: product.ID,
  //     SpecID: newSpecifaction
  //   }

  //   await Specs.SaveProductAssignment(specProductAssignment)
  //   var targetSpec = await Specs.Get(newSpecifaction)
  //   if (targetSpec.DefinesVariant) {
  //     // TODO: ASK in Dialog if Variants shall be regenerated and how?
  //     // In case a variant spec has been deleted, all the variants have to be regenerated
  //     await Products.GenerateVariants(product.ID, {overwriteExisting: true})
  //   }

  //   await dispatch(setProductId(product.ID))
  //   setIsLinking(false)
  //   setNewSpecification("")
  //   setAvailableSpecs(null)
  //   setExpanded(true)
  //   onClose()
  // }

  // const onAvailableSpecClick = (e) => {
  //   e.preventDefault()
  //   const chosenSpec = e.currentTarget.dataset.id
  //   setNewSpecification(chosenSpec)
  //   setIsSpecChosen(true)
  // }

  // const onSpecificationLinkInputChanged = (e) => {
  //   e.preventDefault()
  //   setIsSpecChosen(false)
  //   setNewSpecification(e.target.value)
  //   const availableSpecs = Specs.List({
  //     searchOn: ["Name", "ID"],
  //     search: e.target.value
  //   }).then((innerSpecs) => {
  //     const specIds = specs.map((item) => {
  //       return item.ID
  //     })
  //     const filteredSpecs = innerSpecs.Items.filter(
  //       (innerSpec) => !specIds.includes(innerSpec.ID)
  //     )
  //     setAvailableSpecs(filteredSpecs)
  //   })
  // }

  return (
    <>
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          <HStack float={"right"}>
            <Tooltip label="Add Product Supplier">
              <Button
                colorScheme="brandButtons"
                aria-label="Add Product Supplier"
                disabled={true}
                // onClick={onOpen}
              >
                <FiPlus />
              </Button>
            </Tooltip>
          </HStack>
          <Heading
            position={"relative"}
            size={{base: "md", md: "lg", lg: "xl"}}
          >
            Supplier
            <Tag
              position={"relative"}
              size={"sm"}
              bg={useColorModeValue("brand.500", "brand.700")}
              ml={4}
              color={useColorModeValue("textColor.900", "textColor.100")}
            >
              EDITING COMING SOON
            </Tag>
          </Heading>

          {(isLoading || !product) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Collapse in={expanded}>
                <Box width="full" pb={2} pt={4}>
                  {(supplier?.length ?? 0) == 0 ? (
                    <>No Supplier</>
                  ) : (
                    <BrandedTable>
                      <Thead>
                        <Tr>
                          <Th color={color}>ID</Th>
                          <Th color={color}>Name</Th>
                          <Th color={color}>Is Active</Th>
                          <Th color={color}>All Buyers can Order</Th>
                          <Th color={color}>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody alignContent={"center"}>
                        {supplier?.map((item, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{item.ID}</Td>
                              <Td>{item.Name}</Td>
                              <Td>
                                {item.Active ?? false ? (
                                  <CheckIcon boxSize={6} color={okColor} />
                                ) : (
                                  <CloseIcon boxSize={6} color={errorColor} />
                                )}
                              </Td>
                              <Td>
                                {item.AllBuyersCanOrder ?? false ? (
                                  <CheckIcon boxSize={6} color={okColor} />
                                ) : (
                                  <CloseIcon boxSize={6} color={errorColor} />
                                )}
                              </Td>
                              <Td>
                                {" "}
                                <Tooltip label="Remove Supplier from Product">
                                  <Button
                                    colorScheme="brandButtons"
                                    aria-label="Remove Supplier from Product"
                                    disabled={true}
                                    // onClick={onRemoveSpecification}
                                    data-id={item.ID}
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </Tooltip>
                              </Td>
                            </Tr>
                          )
                        })}
                      </Tbody>
                    </BrandedTable>
                  )}
                </Box>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
      {/* <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        size={"5xl"}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            {isLinking ? (
              <AlertDialogHeader
                textAlign={"center"}
                fontSize="lg"
                fontWeight="bold"
              >
                Linking... <BrandedSpinner />
              </AlertDialogHeader>
            ) : (
              <>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Link Specification to Product
                </AlertDialogHeader>

                <AlertDialogBody>
                  Please choose Specification to link
                </AlertDialogBody>
                <FormControl ml={6}>
                  <Input
                    justifyContent={"center"}
                    width={"90%"}
                    aria-label="Specification ID"
                    value={newSpecifaction}
                    onChange={onSpecificationLinkInputChanged}
                    onFocus={onSpecificationLinkInputChanged}
                    placeholder={"Enter and search for specs..."}
                  />
                </FormControl>
                {(availableSpecs?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available Specs (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availableSpecs.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableSpecClick}
                              data-id={element.ID}
                            >
                              <b>Name:</b> {element.Name} | <b>ID:</b>{" "}
                              {element.ID}
                            </ListItem>
                          </Tooltip>
                        ))}
                      </UnorderedList>
                    </Box>
                  </>
                ) : null}
                <AlertDialogFooter>
                  <Box width={"full"}>
                    {isSpecChosen ? null : (
                      <Text pb={2}>
                        Please choose from the search results to link a spec
                      </Text>
                    )}
                    <Button width={"45%"} size={"md"} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      float={"right"}
                      width={"45%"}
                      size={"md"}
                      colorScheme="brandButtons"
                      onClick={onSpecificationLink}
                      ml={3}
                      disabled={!isSpecChosen}
                    >
                      Link
                    </Button>
                  </Box>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog> */}
    </>
  )
}
