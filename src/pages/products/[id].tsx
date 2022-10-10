import {
  Box,
  Flex,
  Heading,
  HStack,
  Tooltip,
  Grid,
  GridItem,
  Button,
  Container,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  useDisclosure,
  Progress,
  Text
} from "@chakra-ui/react"
import BrandedBox from "lib/components/branding/BrandedBox"
import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import BreadcrumbNavigation from "lib/components/navigation/BreadcrumbNavigation"
import EditorialProgressBar from "lib/components/products/EditorialProgressBar"
import ProductBasicData from "lib/components/products/ProductBasicData"
import ProductCatalogAssignments from "lib/components/products/ProductCatalogAssignments"
import ProductCategoryAssignments from "lib/components/products/ProductCategoryAssignments"
import ProductData from "lib/components/products/ProductData"
import ProductInventoryData from "lib/components/products/ProductInventoryData"
import ProductInventoryRecords from "lib/components/products/ProductInventoryRecords"
import ProductMeasurementData from "lib/components/products/ProductMeasurementData"
import ProductPriceScheduleAssignments from "lib/components/products/ProductPriceScheduleAssignments"
import ProductSpecs from "lib/components/products/ProductSpecs"
import ProductSuppliers from "lib/components/products/ProductSupllier"
import ProductVariants from "lib/components/products/ProductVariants"
import ProductXpInformation from "lib/components/products/ProductXpInformation"
import useOcProductDetail from "lib/hooks/useOcProductDetail"
import {setProductId} from "lib/redux/ocProductDetail"
import {OcProductListOptions, setListOptions} from "lib/redux/ocProductList"
import {useOcDispatch} from "lib/redux/ocStore"
import {NextSeo} from "next-seo"
import {useRouter} from "next/router"
import {Products} from "ordercloud-javascript-sdk"
import React from "react"
import {useEffect, useState} from "react"
import {FiRefreshCw, FiTrash2} from "react-icons/fi"

const ProductDetails = () => {
  const router = useRouter()

  const dispatch = useOcDispatch()
  const {id} = router.query
  const productDetails = useOcProductDetail(id as string)
  const [prodcutName, setProductName] = useState("")
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>()
  const [isDeleting, setIsDeleting] = useState(false)
  const options: OcProductListOptions = {}

  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  interface BreadcrumbItem {
    name: string
    url: string
  }
  interface Breadcrumb {
    items: BreadcrumbItem[]
  }

  const onDelete = (e) => {
    setIsDeleting(true)
    e.preventDefault()
    Products.Delete(productDetails.product.ID)
    setTimeout(() => {
      setIsDeleting(false)
      onClose()
      dispatch(setListOptions(options))
      router.push("/products")
    }, 4000)
  }

  useEffect(() => {
    // TODO: Add 404 Handling if product really does not exist
    const doSetBreadcrumb = () => {
      const breadcrumbItems: BreadcrumbItem[] = [
        {
          name: "Home",
          url: "/"
        },
        {
          name: "Products",
          url: "/products"
        },
        {
          name: productDetails.product?.Name ?? "...",
          url: "/products/" + productDetails.product?.ID ?? ""
        }
      ]
      const tmpbreadcrumb: Breadcrumb = {
        items: breadcrumbItems
      }
      setBreadcrumb(tmpbreadcrumb)
    }

    setProductName(productDetails.product?.Name ?? "")
    doSetBreadcrumb()
  }, [productDetails])

  return (
    <>
      {/* {prodcutName !== "" ? ( */}
      <>
        {breadcrumb?.items?.length ?? 0 > 0 ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
            mb={1}
            p={18}
            w="full"
            color={"black"}
          >
            <BreadcrumbNavigation breadcrumbs={breadcrumb?.items ?? null} />
          </Flex>
        ) : (
          <></>
        )}
        <NextSeo title="Product Details" />
        <Heading
          color={"black"}
          as="h1"
          size={{sm: "lg"}}
          pb={2}
          ml={5}
          display={{base: "block", sm: "inline-block", md: "none"}}
        >
          Product Detail Page: {prodcutName == "" ? "..." : null}{" "}
          <i>{prodcutName}</i>
        </Heading>
        <HStack justifyContent={"space-between"} px={6} width={"full"}>
          <Heading
            color={"black"}
            as="h1"
            width={"full"}
            size={{base: "md", sm: "md", md: "lg", lg: "lg", xl: "xl"}}
            display={{base: "none", sm: "none", md: "block"}}
          >
            Product Detail Page: {prodcutName == "" ? "..." : null}{" "}
            <i>{prodcutName}</i>
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
                colorScheme="purple"
                aria-label="Refresh Product Data"
                width={{
                  base: "50%",
                  sm: "50%",
                  md: "50%",
                  lg: "40%",
                  xl: "30%",
                  "2xl": "15%"
                }}
                onClick={(e) => {
                  dispatch(setProductId(productDetails.product.ID))
                }}
              >
                <FiRefreshCw />
              </Button>
            </Tooltip>
            <Tooltip label="Delete Product">
              <Button
                colorScheme="purple"
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
            {/* <GridItem rowSpan={1} colSpan={6}>
              <ProductBasicData product={productDetails.product} />
            </GridItem> */}
            <GridItem rowSpan={1} colSpan={6}>
              <EditorialProgressBar product={productDetails?.product} />
            </GridItem>

            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 4}}
            >
              <ProductData product={productDetails.product} />
            </GridItem>

            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 3, xl: 2}}
            >
              <ProductMeasurementData product={productDetails.product} />
            </GridItem>
            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 3, xl: 3}}
            >
              <ProductInventoryData product={productDetails.product} />
            </GridItem>
            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 2, xl: 3}}
            >
              <ProductXpInformation product={productDetails.product} />
            </GridItem>
            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 4, xl: 6}}
            >
              <ProductCatalogAssignments product={productDetails.product} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={6}>
              <ProductSpecs
                product={productDetails.product}
                specs={productDetails.specs}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={6}>
              <ProductVariants
                product={productDetails.product}
                variants={productDetails.variants}
              />
            </GridItem>

            <GridItem rowSpan={1} colSpan={6}>
              <ProductPriceScheduleAssignments
                product={productDetails.product}
              />
            </GridItem>
            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 6}}
            >
              <ProductSuppliers product={productDetails.product} />
            </GridItem>
            <GridItem
              rowSpan={1}
              colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 6}}
            >
              <ProductInventoryRecords product={productDetails.product} />
            </GridItem>
          </Grid>
        </Container>
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
                  <Button onClick={onClose}>Cancel</Button>
                  <Button colorScheme="red" onClick={onDelete} ml={3}>
                    Delete
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

export default ProductDetails
