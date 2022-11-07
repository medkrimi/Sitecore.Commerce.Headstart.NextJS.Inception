import {CheckIcon, CloseIcon, Search2Icon, SearchIcon} from "@chakra-ui/icons"
import {
  Text,
  Center,
  Checkbox,
  Image,
  Link,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  Flex
} from "@chakra-ui/react"
import {
  FiCheckSquare,
  FiArrowDown,
  FiArrowUp,
  FiArrowRight
} from "react-icons/fi"
import BrandedSpinner from "../branding/BrandedSpinner"
import NextLink from "next/link"
import {stripHTML} from "lib/utils/stripHTML"
import {useState} from "react"
import {Product} from "ordercloud-javascript-sdk"
import {ProductXPs} from "lib/types/ProductXPs"
import {CalculateEditorialProcess} from "./EditorialProgressBar"

const ProductList = (props) => {
  const [componentProducts, setComponentProducts] = useState<
    Product<ProductXPs>[]
  >(props.products)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [sortBy, setSortBy] = useState("")
  const onSortByNameClickedInside = (columnName) => {
    setSortBy(columnName)
    props.onSort(columnName)
    console.log("Inside ProductList " + columnName)
    console.log(props.onSort)
  }
  return (
    <>
      {componentProducts ? (
        <>
          <Thead>
            <Tr>
              <Th cursor={"pointer"}>
                <Tooltip label={"Click here to select / unselect all Products"}>
                  <Flex justifyContent={"flex-start"}>
                    <FiCheckSquare />
                    <Text ml={2}>Product ID</Text>
                  </Flex>
                </Tooltip>
              </Th>
              <Th>Image</Th>
              <Th>
                <Tooltip label="Sort by Name">
                  <Flex justifyContent={"flex-start"}>
                    {sortBy == "name" ? (
                      <FiArrowUp
                        cursor={"pointer"}
                        onClick={() => props.onSort("!name")}
                      />
                    ) : sortBy == "!name" ? (
                      <FiArrowDown
                        cursor={"pointer"}
                        onClick={() => props.onSort("name")}
                      />
                    ) : (
                      <FiArrowRight
                        cursor={"pointer"}
                        onClick={() => props.onSort("name")}
                      />
                    )}

                    <Text ml={2}>Product Name</Text>
                  </Flex>
                </Tooltip>
              </Th>
              <Th>Description</Th>
              {/* <Th color={color}>Description</Th> */}
              <Th>
                <Tooltip label="Sort by Is Active">
                  <Flex justifyContent={"flex-start"}>
                    {sortBy == "Active" ? (
                      <FiArrowUp
                        cursor={"pointer"}
                        onClick={() => onSortByNameClickedInside("!Active")}
                      />
                    ) : sortBy == "!Active" ? (
                      <FiArrowDown
                        cursor={"pointer"}
                        onClick={() => onSortByNameClickedInside("Active")}
                      />
                    ) : (
                      <FiArrowRight
                        cursor={"pointer"}
                        onClick={() => onSortByNameClickedInside("Active")}
                      />
                    )}

                    <Text ml={2}>Active?</Text>
                  </Flex>
                </Tooltip>
              </Th>
              <Th>
                <Flex justifyContent={"center"}>
                  <Text>Qty</Text>
                </Flex>
              </Th>
              <Th>
                <Tooltip label="Sort by Editorial Progress">
                  <Flex justifyContent={"flex-start"}>
                    {sortBy == "editorialProgress" ? (
                      <FiArrowUp
                        cursor={"editorialProgress"}
                        onClick={() =>
                          onSortByNameClickedInside("!editorialProgress")
                        }
                      />
                    ) : sortBy == "!editorialProgress" ? (
                      <FiArrowDown
                        cursor={"pointer"}
                        onClick={() =>
                          onSortByNameClickedInside("editorialProgress")
                        }
                      />
                    ) : (
                      <FiArrowRight
                        cursor={"pointer"}
                        onClick={() =>
                          onSortByNameClickedInside("editorialProgress")
                        }
                      />
                    )}

                    <Text ml={2}>Editorial Progress</Text>
                  </Flex>
                </Tooltip>
              </Th>
            </Tr>
          </Thead>
          <Tbody alignContent={"center"}>
            {componentProducts && componentProducts.length > 0 ? (
              componentProducts.map((product, index) => (
                <Tr key={index}>
                  <Td>
                    <Checkbox
                      onChange={() => props.onCheckChange(product.ID)}
                    />
                    <NextLink href={"/products/" + product.ID} passHref>
                      <Link> {product.ID}</Link>
                    </NextLink>
                  </Td>
                  <Td>
                    <Center>
                      <NextLink href={"/products/" + product.ID} passHref>
                        <Link>
                          <Image
                            src={
                              typeof product?.xp?.Images != "undefined"
                                ? product?.xp?.Images[0]?.ThumbnailUrl
                                : "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"
                            }
                            alt="product image"
                            width="50px"
                          />
                        </Link>
                      </NextLink>
                    </Center>
                  </Td>
                  <Td>
                    <NextLink href={"/products/" + product.ID} passHref>
                      <Link>{product.Name}</Link>
                    </NextLink>
                  </Td>
                  <Td>
                    {stripHTML(product.Description).length > 40
                      ? stripHTML(product.Description).substring(0, 40) + "..."
                      : stripHTML(product.Description)}
                  </Td>
                  <Td>
                    {product.Active ? (
                      <CheckIcon boxSize={6} color={okColor} />
                    ) : (
                      <CloseIcon boxSize={6} color={errorColor} />
                    )}
                  </Td>
                  <Td textAlign={"right"}>
                    {product?.Inventory?.QuantityAvailable}
                  </Td>
                  <Td>{CalculateEditorialProcess(product)}%</Td>
                </Tr>
              ))
            ) : (
              <Text p={3}>No Products found</Text>
            )}
          </Tbody>
        </>
      ) : (
        <BrandedSpinner />
      )}
    </>
  )
}
export default ProductList
