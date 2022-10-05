import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  useColorMode,
  useColorModeValue,
  Box,
  Heading,
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Collapse,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  Checkbox
} from "@chakra-ui/react"
import {setProductId} from "lib/redux/ocProductDetail"
import {useOcDispatch} from "lib/redux/ocStore"
import {
  RequiredDeep,
  Product,
  Variant,
  Products
} from "ordercloud-javascript-sdk"
import React from "react"
import {useState} from "react"
import {FiMinus, FiPlus, FiRefreshCw, FiTrash2, FiZap} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"

type ProductDataProps = {
  product: RequiredDeep<Product<any>>
  variants: RequiredDeep<Variant<any>>[]
}

export default function ProductVariants({product, variants}: ProductDataProps) {
  const {colorMode, toggleColorMode} = useColorMode()
  const color = useColorModeValue("textColor.900", "textColor.100")
  const dispatch = useOcDispatch()
  const gradient =
    colorMode === "light"
      ? "linear(to-t, brand.300, brand.400)"
      : "linear(to-t, brand.600, brand.500)"
  const shadow = "5px 5px 5px #999999"
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [overwriteExistingVariants, setOverwriteExistingVariants] =
    useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  const onGenerateVariantsClicked = async (e) => {
    setIsGenerating(true)
    e.preventDefault()
    await Products.GenerateVariants(product.ID, {
      overwriteExisting: overwriteExistingVariants
    })
    await dispatch(setProductId(product.ID))
    setIsGenerating(false)
    onClose()
    setExpanded(true)
  }

  const onVariantStatusChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const variantId = e.currentTarget.dataset.id
    let variant = variants.find((element) => element.ID == variantId)
    const newVariant: Variant<any> = {
      Active: !variant.Active,
      ID: variant.ID
    }
    await Products.PatchVariant(product.ID, variantId, newVariant)
    await dispatch(setProductId(product.ID))
    setIsLoading(false)
  }

  return (
    <>
      {" "}
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          <HStack float={"right"}>
            <Tooltip label="Generate variants">
              <Button
                colorScheme="purple"
                aria-label="Generate Variants"
                onClick={onOpen}
              >
                <FiZap />
              </Button>
            </Tooltip>
          </HStack>{" "}
          <Heading size={{base: "md", md: "lg", lg: "xl"}}>Variants</Heading>
          {(isLoading || !product) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Collapse in={expanded}>
                <Box width="full" pb={2} pt={4}>
                  {variants?.length ?? 0 > 0 ? (
                    <>
                      <BrandedTable>
                        <Thead boxShadow={shadow} bgGradient={gradient}>
                          <Tr>
                            <Th color={color}>ID</Th>
                            <Th color={color}>Name</Th>
                            <Th color={color}>Is Active?</Th>
                            <Th color={color}>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody alignContent={"center"}>
                          {variants ? (
                            <>
                              {variants.map((item, index) => {
                                return (
                                  <Tr key={index}>
                                    <Td>{item.ID}</Td>
                                    <Td>{item.Name}</Td>
                                    <Td>
                                      {" "}
                                      {item?.Active ?? false ? (
                                        <CheckIcon
                                          boxSize={6}
                                          color={okColor}
                                        />
                                      ) : (
                                        <CloseIcon
                                          boxSize={6}
                                          color={errorColor}
                                        />
                                      )}
                                    </Td>
                                    <Td>
                                      {item?.Active ?? false ? (
                                        <Tooltip label="Deactivate Variant">
                                          <Button
                                            colorScheme="purple"
                                            aria-label="Deactivate variant"
                                            onClick={onVariantStatusChange}
                                            data-id={item.ID}
                                          >
                                            <FiMinus />
                                          </Button>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip label="Activate Variant">
                                          <Button
                                            colorScheme="purple"
                                            aria-label="Activate Variant"
                                            onClick={onVariantStatusChange}
                                            data-id={item.ID}
                                          >
                                            <FiPlus />
                                          </Button>
                                        </Tooltip>
                                      )}
                                    </Td>
                                  </Tr>
                                )
                              })}
                            </>
                          ) : (
                            <>No Variants</>
                          )}
                        </Tbody>
                      </BrandedTable>
                    </>
                  ) : (
                    <>No Variants</>
                  )}
                </Box>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            {isGenerating ? (
              <AlertDialogHeader
                textAlign={"center"}
                fontSize="lg"
                fontWeight="bold"
              >
                Generating... <BrandedSpinner />
              </AlertDialogHeader>
            ) : (
              <>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Generate Variants
                </AlertDialogHeader>

                <AlertDialogBody>
                  Would you like to overwrite existing Variants?
                </AlertDialogBody>
                <Checkbox
                  mx={6}
                  mb={2}
                  aria-label="Overwrite Existing Variants?"
                  isChecked={overwriteExistingVariants}
                  onChange={(e) => {
                    setOverwriteExistingVariants(e.target.checked)
                  }}
                />
                <AlertDialogFooter>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    colorScheme="purple"
                    onClick={onGenerateVariantsClicked}
                    ml={3}
                  >
                    Generate
                  </Button>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
