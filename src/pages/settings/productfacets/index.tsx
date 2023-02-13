import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"
import Card from "lib/components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import Link from "../../../lib/components/navigation/Link"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {productfacetsService} from "lib/api/productfacets"
import {useRouter} from "next/router"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"
import SearchDataTable from "lib/components/datatable/datatable"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Facets List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductFacetsPage = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const [productfacets, setProductFacets] = useState([])
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}

  useEffect(() => {
    const getProductFacets = async () => {
      const productfacetsList = productfacetsService.getAll()
      setProductFacets((await productfacetsList).Items)
    }
    getProductFacets()
  }, [])

  async function initProductFacetsData(productfacetid) {
    const productfacetList = await productfacetsService.getAll()
    setProductFacets(productfacetList.Items)
  }

  async function deleteProductFacet(productfacetid) {
    try {
      await productfacetsService.delete(productfacetid)
      initProductFacetsData(router.query.buyerid)
      successToast({
        description: "Product Facet deleted successfully."
      })
    } catch (e) {
      errorToast({
        description: "Product Facet delete failed"
      })
    }
  }

  const columnsData = [
    {
      Header: "NAME",
      accessor: "Name",
      Cell: ({value, row}) => <Link href={`/settings/productfacets/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "ID",
      accessor: "ID"
    },
    {
      Header: "FACET OPTIONS",
      accessor: "xp.Options",
      Cell: ({value}) => (value || []).join(", ")
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button variant="secondaryButton" onClick={() => router.push(`/settings/productfacets/${row.original.ID}/`)}>
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteProductFacet(row.original.ID)}>
            Delete
          </Button>
        </ButtonGroup>
      )
    }
  ]

  return (
    <Container maxW="full">
      <NextSeo title="Product Facets List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/settings/productfacets/add`}>
          <Button variant="primaryButton">New Product Facet</Button>
        </Link>
        <HStack>
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <SearchDataTable tableData={productfacets} columnsData={columnsData}></SearchDataTable>
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Product Facets to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected product facets to a CSV, once the export button is clicked behind the scense a job
                will be kicked off to create the csv and then will automatically download to your downloads folder in
                the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestExportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Export Product Facets"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

const ProtectedProductFacetsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductFacetsPage />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsPage
