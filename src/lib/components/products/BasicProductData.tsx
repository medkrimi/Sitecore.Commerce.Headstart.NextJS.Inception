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
  Spinner
} from "@chakra-ui/react"
import {Product, RequiredDeep} from "ordercloud-javascript-sdk"
import {useState} from "react"
import {FiCheck, FiEdit, FiX} from "react-icons/fi"

type ProductDataProps = {
  product: RequiredDeep<Product<any>>
}

export default function BasicProductData({product}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const bg = useColorModeValue("gray.400", "gray.600")
  const {colorMode, toggleColorMode} = useColorMode()
  const color = useColorModeValue("black", "white")
  const spinnerColor = useColorModeValue("brand.200", "brand.600")
  const gradient =
    colorMode === "light"
      ? "linear(to-t, brand.300, brand.500)"
      : "linear(to-t, brand.600, brand.400)"
  const shadow = "0px 15px 15px gray"

  return (
    <>
      <Box
        p={6}
        boxShadow={shadow}
        rounded={"lg"}
        zIndex={1}
        color={color}
        bgGradient={gradient}
      >
        {isEditingBasicData ? (
          <HStack float={"right"}>
            <Tooltip label="Save">
              <Button
                colorScheme="brandButtons"
                aria-label="Save"
                onClick={() => setIsEditingBasicData(false)}
              >
                <FiCheck />
              </Button>
            </Tooltip>
            <Tooltip label="Abort">
              <Button
                colorScheme="brandButtons"
                aria-label="Abort"
                onClick={() => setIsEditingBasicData(false)}
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
                onClick={() => setIsEditingBasicData(true)}
              >
                <FiEdit />
              </Button>
            </Tooltip>
          </HStack>
        )}
        {!product ? (
          <Box pt={6} textAlign={"center"}>
            Updating...{" "}
            <Spinner
              color={spinnerColor}
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
            />
          </Box>
        ) : (
          <>
            <Heading>Basic Data</Heading>
            <Box width="full" pb={2} pt={4}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Product Name:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.Name}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                ID:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.ID}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Description:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.Description}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Default Price Schedule ID:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.DefaultPriceScheduleID ?? "Not set"}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Quantity Multiplier:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.QuantityMultiplier ?? "Not set"}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Ship Weight:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.ShipWeight ?? "Not set"}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Ship Height:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.ShipHeight ?? "Not set"}
              </Heading>
            </Box>

            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Ship Length:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.ShipLength ?? "Not set"}
              </Heading>
            </Box>

            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Ship Width:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.ShipWidth ?? "Not set"}
              </Heading>
            </Box>

            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Ship from Address:
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.ShipFromAddressID ?? "Not set"}
              </Heading>
            </Box>

            <Text>{product?.DefaultSupplierID}</Text>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                All Suppliers can sell?{" "}
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.AllSuppliersCanSell ?? false ? (
                  <CheckIcon boxSize={6} color={okColor} />
                ) : (
                  <CloseIcon boxSize={6} color={errorColor} />
                )}
              </Heading>
            </Box>
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Returnable?{" "}
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.Returnable ?? false ? (
                  <CheckIcon boxSize={6} color={okColor} />
                ) : (
                  <CloseIcon boxSize={6} color={errorColor} />
                )}
              </Heading>
            </Box>
            {/* TODO INVENTORY */}
            <Box width="full" pb={2}>
              <Text opacity={0.5} fontWeight={"bold"}>
                Is Active{" "}
              </Text>
              <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                {product?.Active ?? false ? (
                  <CheckIcon boxSize={6} color={okColor} />
                ) : (
                  <CloseIcon boxSize={6} color={errorColor} />
                )}
              </Heading>
            </Box>
          </>
        )}
      </Box>
    </>
  )
}
