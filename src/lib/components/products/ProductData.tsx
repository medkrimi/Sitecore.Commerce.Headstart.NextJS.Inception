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
import {
  ComposedProduct,
  GetComposedProduct
} from "lib/scripts/OrdercloudService"
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
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductData({
  composedProduct,
  setComposedProduct
}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const color = useColorModeValue("textColor.100", "textColor.300")
  const [expanded, setExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    name: composedProduct?.Product?.Name,
    id: composedProduct?.Product?.ID,
    description: composedProduct?.Product?.Description,
    defaultPriceScheduleId: composedProduct?.Product?.DefaultPriceScheduleID,
    quantityMultiplier: composedProduct?.Product?.QuantityMultiplier,
    shipFromAddress: composedProduct?.Product?.ShipFromAddressID,
    returnable: composedProduct?.Product?.Returnable,
    isActive: composedProduct?.Product?.Active,
    allSuppliersCanSell: composedProduct?.Product?.AllSuppliersCanSell,
    defaultSupplierId: composedProduct?.Product?.DefaultSupplierID
  })

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      if (fieldKey == "name" && e.target.value == "") {
        return
      }
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
      ["name"]: composedProduct?.Product?.Name,
      ["id"]: composedProduct?.Product?.ID,
      ["description"]: composedProduct?.Product?.Description,
      ["defaultPriceScheduleId"]:
        composedProduct?.Product?.DefaultPriceScheduleID,
      ["quantityMultiplier"]: composedProduct?.Product?.QuantityMultiplier,
      ["shipFromAddress"]: composedProduct?.Product?.ShipFromAddressID,
      ["returnable"]: composedProduct?.Product?.Returnable,
      ["isActive"]: composedProduct?.Product?.Active,
      ["allSuppliersCanSell"]: composedProduct?.Product?.AllSuppliersCanSell
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["name"]: composedProduct?.Product?.Name,
      ["id"]: composedProduct?.Product?.ID,
      ["description"]: composedProduct?.Product?.Description,
      ["defaultPriceScheduleId"]:
        composedProduct?.Product?.DefaultPriceScheduleID,
      ["quantityMultiplier"]: composedProduct?.Product?.QuantityMultiplier,
      ["shipFromAddress"]: composedProduct?.Product?.ShipFromAddressID,
      ["returnable"]: composedProduct?.Product?.Returnable,
      ["isActive"]: composedProduct?.Product?.Active,
      ["allSuppliersCanSell"]: composedProduct?.Product?.AllSuppliersCanSell
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const patchedProduct: Product = {
      Name: formValues.name,
      Active: formValues.isActive,
      AllSuppliersCanSell: formValues.allSuppliersCanSell,
      DefaultPriceScheduleID: formValues.defaultPriceScheduleId,
      Description: formValues.description,
      // ID: formValues.id,
      QuantityMultiplier: formValues.quantityMultiplier,
      Returnable: formValues.returnable,
      ShipFromAddressID: formValues.shipFromAddress
    }
    await Products.Patch(composedProduct?.Product?.ID, patchedProduct)

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(async () => {
      var product = await GetComposedProduct(composedProduct?.Product?.ID)
      setComposedProduct(product)
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 2500)
    }, 4500)
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
                  <FiX color={color} />
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
                  <FiEdit color={color} />
                </Button>
              </Tooltip>
            </HStack>
          )}
          {(!composedProduct?.Product || isLoading) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Heading
                size={{base: "md", md: "lg", lg: "xl"}}
                mb={expanded ? 6 : 0}
              >
                Product Data
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Container>
                    <Tooltip
                      label={
                        isEditingBasicData
                          ? "Product Name is mandatory to fill"
                          : ""
                      }
                    >
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Product Name:*
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues.name}
                            onChange={handleInputChange("name")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {composedProduct?.Product?.Name}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Tooltip
                      label={isEditingBasicData ? "ID is not changeable" : ""}
                    >
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          ID:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            disabled={true}
                            value={formValues.id}
                            onChange={handleInputChange("productId")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {composedProduct?.Product?.ID}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Description:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.description}
                          onChange={handleInputChange("description")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {composedProduct?.Product?.Description}
                        </Heading>
                      )}
                    </Box>
                    <Tooltip label="When provided, no explicit PriceSchedule assignment is required. When a PriceSchedule assignment exists, it will override any default provided.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Default Price Schedule ID:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues.defaultPriceScheduleId}
                            onChange={handleInputChange(
                              "defaultPriceScheduleId"
                            )}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {composedProduct?.Product?.DefaultPriceScheduleID ??
                              "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                  </Container>
                  <Container>
                    <Tooltip label="Marketplace Owner or Supplier AddressID where the product will be shipped from. Can be used to calculate shipping costs.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Ship from Address:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues.shipFromAddress}
                            onChange={handleInputChange("shipFromAddress")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {composedProduct?.Product?.ShipFromAddressID ??
                              "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Tooltip label="If this property has a value and a SupplierID isn't explicitly passed when creating a LineItem, this SupplierID will be used.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Default Supplier ID
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues?.defaultSupplierId}
                            onChange={handleInputChange("defaultSupplierId")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {composedProduct?.Product?.DefaultSupplierID ??
                              "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        All Suppliers can sell?{" "}
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.allSuppliersCanSell}
                          onChange={handleCheckboxChange("allSuppliersCanSell")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {composedProduct?.Product?.AllSuppliersCanSell ??
                          false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                  </Container>
                  <Container>
                    <Tooltip label="For reference only, does not influence any OrderCloud behavior. Used to indicate an amount per Quantity.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Quantity Multiplier:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            type={"number"}
                            value={formValues.quantityMultiplier}
                            onChange={handleNumberInputChange(
                              "quantityMultiplier"
                            )}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {composedProduct?.Product?.QuantityMultiplier ??
                              "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Returnable?{" "}
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.returnable}
                          onChange={handleCheckboxChange("returnable")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {composedProduct?.Product?.Returnable ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Is Active{" "}
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.isActive}
                          onChange={handleCheckboxChange("isActive")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {composedProduct?.Product?.Active ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
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
