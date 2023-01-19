import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Tooltip,
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import {
  ComposedProduct,
  GetComposedProduct
} from "lib/services/ordercloud.service"
import {FiRefreshCw, FiTrash2} from "react-icons/fi"
import {useEffect, useState} from "react"

import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import EditorialProgressBar from "lib/components/products/EditorialProgressBar"
import {NextSeo} from "next-seo"
import ProductCatalogAssignments from "lib/components/products/ProductCatalogAssignments"
import ProductData from "lib/components/products/ProductData"
import ProductInventoryData from "lib/components/products/ProductInventoryData"
import ProductInventoryRecords from "lib/components/products/ProductInventoryRecords"
import ProductMeasurementData from "lib/components/products/ProductMeasurementData"
import ProductMediaInformation from "lib/components/products/ProductMediaInformation"
import ProductPriceScheduleAssignments from "lib/components/products/ProductPriceScheduleAssignments"
import ProductSpecs from "lib/components/products/ProductSpecs"
import ProductSuppliers from "lib/components/products/ProductSupllier"
import ProductVariants from "lib/components/products/ProductVariants"
//import ProductXpInformation from "lib/components/products/ProductXpInformation"
import ProductXpCards from "lib/components/products/ProductXpCards"
import {Products} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"
import Card from "lib/components/card/Card"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Detail Page:",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductDetails = () => {
  const router = useRouter()
  const {id} = router.query
  const [composedProduct, setComposedProduct] = useState<ComposedProduct>(null)
  const [productName, setProductName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  const onDelete = (e) => {
    setIsDeleting(true)
    e.preventDefault()
    Products.Delete(composedProduct?.Product?.ID)
    setTimeout(() => {
      setIsDeleting(false)
      onClose()
      router.push("/products")
    }, 4000)
  }

  useEffect(() => {
    async function LoadProduct() {
      var product = await GetComposedProduct(id as string)
      if (
        product?.Product &&
        composedProduct?.Product?.ID != product.Product.ID
      ) {
        setComposedProduct(product)
      }
    }

    LoadProduct()

    setProductName(composedProduct?.Product?.Name ?? "")
  }, [composedProduct, id])

  return (
    <VStack w="full">
      <>
        {/* {productName !== "" ? ( */}
        <>
          <NextSeo title="Product Details" />
          <VStack justifyContent={"space-between"} px={6} width={"full"}>
            <Heading
              //color={color}
              as="h1"
              width={"full"}
              size={{base: "md", sm: "md", md: "lg", lg: "lg", xl: "xl"}}
              display={{base: "none", sm: "none", md: "block"}}
            >
              {productName == "" ? "..." : null} <i>{productName}</i>
            </Heading>
            <HStack
              justifyContent={{
                base: "flex-start",
                sm: "flex-start",
                md: "flex-end"
              }}
              width={"full"}
            >
              <Tooltip label="Refresh Product Data">
                <Button
                  variant="secondaryButton"
                  aria-label="Refresh Product Data"
                  width={{
                    base: "50%",
                    sm: "50%",
                    md: "50%",
                    lg: "40%",
                    xl: "30%",
                    "2xl": "15%"
                  }}
                  onClick={async (e) => {
                    var product = await GetComposedProduct(
                      composedProduct?.Product?.ID
                    )
                    setComposedProduct(product)
                  }}
                >
                  <FiRefreshCw />
                </Button>
              </Tooltip>
              <Tooltip label="Delete Product">
                <Button
                  variant="secondaryButton"
                  aria-label="Delete Product"
                  width={{
                    base: "50%",
                    sm: "50%",
                    md: "50%",
                    lg: "40%",
                    xl: "30%",
                    "2xl": "15%"
                  }}
                  onClick={onOpen}
                >
                  <FiTrash2 />
                </Button>
              </Tooltip>
            </HStack>

            <Container maxW={"full"} pb={8}>
              <Grid
                templateRows={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(1, 1fr)"
                }}
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(3, 1fr)",
                  sm: "repeat(3, 1fr)",
                  lg: "repeat(6, 1fr)"
                }}
                gap={12}
                mt={8}
                gridGap={{base: 4, sm: 4, md: 8, lg: 12}}
              >
                <GridItem rowSpan={1} colSpan={6}>
                  <EditorialProgressBar product={composedProduct?.Product} />
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 4}}
                >
                  <Card variant="primaryCard" closedText="Product Data">
                    <ProductData
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 2, xl: 2}}
                >
                  <Card variant="primaryCard" closedText="Media">
                    <ProductMediaInformation
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={2}>
                  <Card
                    variant="primaryCard"
                    h={"100%"}
                    closedText="Extended Properties Cards"
                  >
                    <ProductXpCards
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 4, xl: 2}}
                >
                  <Card
                    variant="primaryCard"
                    h={"100%"}
                    closedText="Catalog Assignments"
                  >
                    <ProductCatalogAssignments
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 4, xl: 2}}
                >
                  <Card variant="primaryCard" h={"100%"} closedText="Inventory">
                    <ProductInventoryData
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={6}>
                  <Card variant="primaryCard" closedText="Price Schedules">
                    <ProductPriceScheduleAssignments
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 4}}
                >
                  <Card variant="primaryCard" h={"100%"} closedText="Supplier">
                    <ProductSuppliers
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 3, xl: 2}}
                >
                  <Card variant="primaryCard" h={"100%"} closedText="Sizes">
                    <ProductMeasurementData
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={4}>
                  <Card variant="primaryCard" h={"100%"} closedText="Specs">
                    <ProductSpecs
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={2}>
                  <Card variant="primaryCard" h={"100%"} closedText="Variants">
                    <ProductVariants
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 6}}
                >
                  <Card
                    variant="primaryCard"
                    h={"100%"}
                    closedText="Inventory Records"
                  >
                    <ProductInventoryRecords
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
              </Grid>
            </Container>
          </VStack>
        </>

        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              {isDeleting ? (
                <AlertDialogHeader
                  textAlign={"center"}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Deleting... <BrandedSpinner />
                </AlertDialogHeader>
              ) : (
                <>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Product
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can&apos;t undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button variant="tertiaryButton" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="tertiaryButton"
                      colorScheme="red"
                      onClick={onDelete}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    </VStack>
  )
}

const ProtectedProductDetails = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetails />
    </ProtectedContent>
  )
}

export default ProtectedProductDetails
