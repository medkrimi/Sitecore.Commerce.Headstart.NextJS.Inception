import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Heading,
  HStack,
  Tooltip,
  useColorModeValue,
  Text,
  useColorMode,
  Spinner,
  Container,
  Flex,
  Collapse,
  Input,
  Checkbox
} from "@chakra-ui/react"
import {setProductId} from "lib/redux/ocProductDetail"
import {useOcDispatch} from "lib/redux/ocStore"
import {
  Inventory,
  Product,
  Products,
  RequiredDeep
} from "ordercloud-javascript-sdk"
import {ChangeEvent, useState} from "react"
import {FiCheck, FiEdit, FiMinus, FiPlus, FiX} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type ProductDataProps = {
  product: RequiredDeep<Product<any>>
}

export default function ProductInventoryData({product}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useOcDispatch()
  const [formValues, setFormValues] = useState({
    inventoryEnabled: product?.Inventory?.Enabled,
    lastUpdated: product?.Inventory?.LastUpdated,
    notificationPoint: product?.Inventory?.NotificationPoint,
    orderCanExceed: product?.Inventory?.OrderCanExceed,
    variantLevelTracking: product?.Inventory?.VariantLevelTracking,
    quantityAvailable: product?.Inventory?.QuantityAvailable
  })

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
    }

  const handleNumberInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({
        ...v,
        [fieldKey]: e.target.value == "" ? 0 : e.target.value
      }))
    }

  const handleCheckboxChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
    }

  const onEditClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["inventoryEnabled"]: product?.Inventory?.Enabled,
      ["lastUpdated"]: product?.Inventory?.LastUpdated,
      ["notificationPoint"]: product?.Inventory?.NotificationPoint,
      ["orderCanExceed"]: product?.Inventory?.OrderCanExceed,
      ["variantLevelTracking"]: product?.Inventory?.VariantLevelTracking,
      ["quantityAvailable"]: product?.Inventory?.QuantityAvailable
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["inventoryEnabled"]: product?.Inventory?.Enabled,
      ["lastUpdated"]: product?.Inventory?.LastUpdated,
      ["notificationPoint"]: product?.Inventory?.NotificationPoint,
      ["orderCanExceed"]: product?.Inventory?.OrderCanExceed,
      ["variantLevelTracking"]: product?.Inventory?.VariantLevelTracking,
      ["quantityAvailable"]: product?.Inventory?.QuantityAvailable
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const patchedInventory: Inventory = {
      Enabled: formValues.inventoryEnabled,
      // LastUpdated: formValues.lastUpdated,
      NotificationPoint: formValues.notificationPoint,
      OrderCanExceed: formValues.orderCanExceed,
      QuantityAvailable: formValues.quantityAvailable,
      VariantLevelTracking: formValues.variantLevelTracking
    }

    const patchedProduct: Product = {
      Name: product.Name,
      Inventory: patchedInventory
    }
    await Products.Patch(product.ID, patchedProduct)

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(() => {
      dispatch(setProductId(product.ID))
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 2000)
    }, 4000)
  }

  return (
    <>
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          {isEditingBasicData ? (
            <HStack float={"right"}>
              <Tooltip label="Save">
                <Button
                  colorScheme="brandButtons"
                  aria-label="Save"
                  onClick={onSaveClicked}
                >
                  <FiCheck />
                </Button>
              </Tooltip>
              <Tooltip label="Abort">
                <Button
                  colorScheme="brandButtons"
                  aria-label="Abort"
                  onClick={onAbortClicked}
                >
                  <FiX />
                </Button>
              </Tooltip>
            </HStack>
          ) : (
            <HStack float={"right"}>
              <Tooltip label="Edit">
                <Button
                  colorScheme="brandButtons"
                  aria-label="Edit"
                  onClick={onEditClicked}
                >
                  <FiEdit />
                </Button>
              </Tooltip>
            </HStack>
          )}
          {(!product || isLoading) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Heading
                size={{base: "md", md: "lg", lg: "xl"}}
                mb={expanded ? 6 : 0}
              >
                Inventory
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Inventory Enabled?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.inventoryEnabled}
                          onChange={handleCheckboxChange("InventoryEnabled")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {product?.Inventory?.Enabled ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                    <Tooltip
                      label={
                        isEditingBasicData
                          ? "Last Updated Date is readonly"
                          : ""
                      }
                    >
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Last Updated:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            disabled={true}
                            value={formValues.lastUpdated}
                            onChange={handleInputChange("lastUpdated")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {new Date(
                              product?.Inventory?.LastUpdated
                            )?.toLocaleString() ?? "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Notification Point:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          type={"number"}
                          value={formValues.notificationPoint}
                          onChange={handleNumberInputChange(
                            "notificationPoint"
                          )}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {product?.Inventory?.NotificationPoint ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Order can exceed?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.orderCanExceed}
                          onChange={handleCheckboxChange("orderCanExceed")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {product?.Inventory?.OrderCanExceed ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                  </Container>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Variant Level Tracking?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.variantLevelTracking}
                          onChange={handleCheckboxChange(
                            "variantLevelTracking"
                          )}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {product?.Inventory?.VariantLevelTracking ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                    <Tooltip
                      label={
                        "In case Inventory records are used, this value is the automatically the sum of all inventory records"
                      }
                    >
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Quantity Available:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            type={"number"}
                            value={formValues.quantityAvailable}
                            onChange={handleNumberInputChange(
                              "quantityAvailable"
                            )}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {product?.Inventory?.QuantityAvailable ?? "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                  </Container>
                </Flex>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
    </>
  )
}
