import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  HStack,
  Heading,
  Input,
  ListItem,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {FiPlus, FiTrash2} from "react-icons/fi"
import {
  InventoryRecord,
  InventoryRecords,
  ListPage,
  Product,
  ProductSupplier,
  Products,
  RequiredDeep,
  Spec,
  SpecProductAssignment,
  Specs,
  Supplier
} from "ordercloud-javascript-sdk"
import React, {useEffect} from "react"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {ComposedProduct} from "../../services/ordercloud.service"
import {useState} from "react"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductInventoryRecords({
  composedProduct,
  setComposedProduct
}: ProductDataProps) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const bg = useColorModeValue("brand.500", "brand.500")
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inventoryRecors, setInventoryRecords] =
    useState<InventoryRecord[]>(null)

  useEffect(() => {
    async function GetProdcutSupplier() {
      if (composedProduct?.Product) {
        var productSupplier = await InventoryRecords.List(
          composedProduct?.Product?.ID
        )
        setInventoryRecords(productSupplier.Items)
      }
    }
    GetProdcutSupplier()
  }, [composedProduct])

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
            <Tooltip label="Add Product Inventory">
              <Button
                colorScheme="brandButtons"
                aria-label="Add Product Inventory"
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
            Inventory Records
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

          {(isLoading || !composedProduct?.Product) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Collapse in={expanded}>
                <Box width="full" pb={2} pt={4}>
                  {(inventoryRecors?.length ?? 0) == 0 ? (
                    <>No Inventory Records</>
                  ) : (
                    <BrandedTable>
                      <Thead>
                        <Tr>
                          <Th color={color}>ID</Th>
                          <Th color={color}>Quantity</Th>
                          <Th color={color}>Address</Th>
                          <Th color={color}>Last Updated</Th>
                          <Th color={color}>Order can exceed?</Th>
                          <Th color={color}>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody alignContent={"center"}>
                        {inventoryRecors?.map((item, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{item.ID}</Td>
                              <Td>{item.QuantityAvailable}</Td>
                              <Td>
                                <Box>
                                  <p>
                                    <b>{item.Address.AddressName}</b>
                                  </p>
                                  <Divider variant={"solid"} />
                                  <p>
                                    {item.Address.FirstName}{" "}
                                    {item.Address.LastName}
                                  </p>
                                  <p>{item.Address.Street1}</p>
                                  <p>
                                    {item.Address.Zip} {item.Address.City}
                                  </p>
                                  <p>{item.Address.Country}</p>
                                </Box>
                              </Td>

                              <Td>
                                {new Date(
                                  composedProduct?.Product?.Inventory?.LastUpdated
                                )?.toLocaleString()}
                              </Td>
                              <Td>
                                {item.OrderCanExceed ?? false ? (
                                  <CheckIcon boxSize={6} color={okColor} />
                                ) : (
                                  <CloseIcon boxSize={6} color={errorColor} />
                                )}
                              </Td>
                              <Td>
                                {" "}
                                <Tooltip label="Remove Inventory Record from Product">
                                  <Button
                                    colorScheme="brandButtons"
                                    aria-label="Remove Inventory Record from Product"
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
