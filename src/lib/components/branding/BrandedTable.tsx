import {
  useColorMode,
  useColorModeValue,
  Box,
  TableContainer,
  Table
} from "@chakra-ui/react"

export default function BrandedTable({children}) {
  const tableHeaderBg = useColorModeValue("brand.300", "brand.700")
  const tableBg = useColorModeValue("brand.300", "brand.500")
  const tableColor = useColorModeValue("textColor.900", "textColor.100")

  return (
    <TableContainer
      width={"full"}
      border={"gray"}
      rounded={20}
      boxShadow={"md"}
      bg={tableHeaderBg}
      color={tableColor}
    >
      <Table variant="striped">{children}</Table>
    </TableContainer>
  )
}
