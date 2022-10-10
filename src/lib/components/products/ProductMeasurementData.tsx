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

export default function ProductMeasurementData({product}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useOcDispatch()
  const [formValues, setFormValues] = useState({
    shipWeight: product?.ShipWeight,
    shipHeight: product?.ShipHeight,
    shipLength: product?.ShipLength,
    shipWidth: product?.ShipWidth
  })

  const handleNumberInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({
        ...v,
        [fieldKey]: e.target.value == "" ? 0 : e.target.value
      }))
    }

  const onEditClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["shipWeight"]: product?.ShipWeight,
      ["shipHeight"]: product?.ShipHeight,
      ["shipLength"]: product?.ShipLength,
      ["shipWidth"]: product?.ShipWidth
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["shipWeight"]: product?.ShipWeight,
      ["shipHeight"]: product?.ShipHeight,
      ["shipLength"]: product?.ShipLength,
      ["shipWidth"]: product?.ShipWidth
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const patchedProduct: Product = {
      Name: product.Name,
      ShipHeight: formValues?.shipHeight,
      ShipLength: formValues.shipLength,
      ShipWeight: formValues.shipWeight,
      ShipWidth: formValues.shipWidth
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
                  colorScheme="purple"
                  aria-label="Save"
                  onClick={onSaveClicked}
                >
                  <FiCheck />
                </Button>
              </Tooltip>
              <Tooltip label="Abort">
                <Button
                  colorScheme="purple"
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
                  colorScheme="purple"
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
                Sizes
              </Heading>
              <Collapse in={expanded}>
                <Box width="full" pb={2}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Ship Weight:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipWeight}
                      onChange={handleNumberInputChange("shipWeight")}
                    />
                  ) : (
                    <Heading
                      fontSize={"xl"}
                      fontFamily={"body"}
                      fontWeight={500}
                    >
                      {product?.ShipWeight ?? "Not set"}
                    </Heading>
                  )}
                </Box>
                <Box width="full" pb={2}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Ship Height:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipHeight}
                      onChange={handleNumberInputChange("shipHeight")}
                    />
                  ) : (
                    <Heading
                      fontSize={"xl"}
                      fontFamily={"body"}
                      fontWeight={500}
                    >
                      {product?.ShipHeight ?? "Not set"}
                    </Heading>
                  )}
                </Box>

                <Box width="full" pb={2}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Ship Length:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipLength}
                      onChange={handleNumberInputChange("shipLength")}
                    />
                  ) : (
                    <Heading
                      fontSize={"xl"}
                      fontFamily={"body"}
                      fontWeight={500}
                    >
                      {product?.ShipLength ?? "Not set"}
                    </Heading>
                  )}
                </Box>

                <Box width="full" pb={2}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Ship Width:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipWidth}
                      onChange={handleNumberInputChange("shipWidth")}
                    />
                  ) : (
                    <Heading
                      fontSize={"xl"}
                      fontFamily={"body"}
                      fontWeight={500}
                    >
                      {product?.ShipWidth ?? "Not set"}
                    </Heading>
                  )}
                </Box>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
    </>
  )
}
