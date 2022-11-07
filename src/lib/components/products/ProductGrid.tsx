import {Text, Tbody, Td, Tr, Box, Grid, GridItem} from "@chakra-ui/react"
import {useState} from "react"
import {Product} from "ordercloud-javascript-sdk"
import {ProductXPs} from "lib/types/ProductXPs"
import ProductCard from "./ProductCard"
//import Image from "next/image"

const ProductGrid = (props) => {
  const products = props.products
  const [componentProducts, setComponentProducts] =
    useState<Product<ProductXPs>[]>(products)

  return (
    <>
      {componentProducts ? (
        <Tbody alignContent={"center"}>
          <Tr>
            <Td colSpan={7}>
              <Grid
                as="section"
                templateColumns="repeat(4, 1fr)"
                templateRows="(3, 1fr)"
                gap={4}
                w="full"
                width="100%"
              >
                {componentProducts && componentProducts.length > 0 ? (
                  componentProducts.map((p) => (
                    <GridItem
                      colSpan={1}
                      rowSpan={1}
                      bg="gridCellBg"
                      w="full"
                      width="100%"
                      rounded="lg"
                      key={p.ID}
                      borderStyle="none"
                    >
                      <ProductCard
                        product={p}
                        onCheck={(productid) => props.onCheck(productid)}
                      />
                    </GridItem>
                  ))
                ) : (
                  <Text p={3}>No Products found</Text>
                )}
              </Grid>
            </Td>
          </Tr>
        </Tbody>
      ) : (
        <Box>
          <Text fontWeight={"bold"} p={3} float={"left"}>
            {componentProducts.length} out of {componentProducts.length}
            Products
          </Text>
        </Box>
      )}
    </>
  )
}
export default ProductGrid
