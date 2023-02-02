import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"
import Card from "lib/components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {HiOutlineMinusSm} from "react-icons/hi"
import Link from "../../../lib/components/navigation/Link"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {productfacetsService} from "lib/api/productfacets"
import {useRouter} from "next/router"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"

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

  async function deleteProductFacets(productfacetid) {
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

  const productfacetsContent = productfacets.length ? (
    productfacets.map((productfacets) => (
      <Tr key={productfacets.ID}>
        <Td>
          <Checkbox pr="10px"></Checkbox>
          <Link href={`/settings/productfacets/${productfacets.ID}`}>{productfacets.Name}</Link>
        </Td>
        <Td>{productfacets.ID}</Td>
        <Td>{productfacets.xp_Options}</Td>
        <Td>
          <Button onClick={() => deleteProductFacets(productfacets.ID)} disabled={loading} variant="tertiaryButton">
            Delete
          </Button>
        </Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={7}>No Product Facets have been created</Td>
    </Tr>
  )

  return (
    <Container maxW="full">
      <NextSeo title="Product Facets List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/settings/productfacets/add`}>
          <Button variant="primaryButton">New Product Facet</Button>
        </Link>
        <HStack>
          <Menu>
            <MenuButton
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              _hover={{bg: "gray.400"}}
              _expanded={{bg: "blue.400"}}
              _focus={{boxShadow: "outline"}}
            >
              Filters <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <VStack>
                  <Text>Product Facet Status</Text>
                  <CheckboxGroup>
                    <Stack spacing={[1, 3]} direction={["column", "row"]}>
                      <Checkbox value="Completed" defaultChecked>
                        Completed
                      </Checkbox>
                      <Checkbox value="AwaitingApproval" defaultChecked>
                        Awaiting Approval
                      </Checkbox>
                      <Checkbox value="Canceled" defaultChecked>
                        Canceled
                      </Checkbox>
                      <Checkbox value="Active" defaultChecked>
                        Active
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                  <Divider />
                  <HStack>
                    {/*<Button size="md" bg={boxBgColor} color={color}>
                      Clear
                    </Button>
                  <Button size="md" bg={boxBgColor} color={color}>
                      Submit
                    </Button> */}
                  </HStack>
                </VStack>
              </MenuItem>
            </MenuList>
          </Menu>
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <IconButton variant="closePanelButton" aria-label="close panel" icon={<HiOutlineMinusSm />}></IconButton>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>ID</Th>
              <Th>Facet Options</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>{productfacetsContent}</Tbody>
        </Table>
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
