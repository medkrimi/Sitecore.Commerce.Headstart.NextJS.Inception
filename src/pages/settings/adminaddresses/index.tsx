import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Spinner,
  Text,
  Link
} from "@chakra-ui/react"
import {useCallback, useEffect, useRef, useState} from "react"
import Card from "lib/components/card/Card"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"
import {useSuccessToast} from "lib/hooks/useToast"
import SearchDataTable from "lib/components/datatable/datatable"
import {AdminAddresses, Address} from "ordercloud-javascript-sdk"
import {addressHelper} from "lib/utils/address.utils"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Admin Address List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const AdminAddressesPage = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [addresses, setAddresses] = useState([] as Address[])
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}

  const getAdminAddresses = useCallback(async () => {
    const adminAddresses = await AdminAddresses.List()
    setAddresses(adminAddresses.Items)
  }, [])

  useEffect(() => {
    getAdminAddresses()
  }, [getAdminAddresses])

  async function deleteAddress(addressId: string): Promise<void> {
    await AdminAddresses.Delete(addressId)
    await getAdminAddresses()
    successToast({
      description: "Address deleted successfully"
    })
  }

  const columnsData = [
    {
      Header: "ID",
      accessor: "ID",
      Cell: ({value, row}) => <Link href={`/settings/adminaddresses/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "ADDRESS NAME",
      accessor: "AddressName",
      Cell: ({value, row}) => <Link href={`/settings/adminaddresses/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "ADDRESS",
      Cell: ({row}: {row}) => addressHelper.formatOneLineAddress(row.original)
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button variant="secondaryButton" onClick={() => router.push(`/settings/adminaddresses/${row.original.ID}/`)}>
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteAddress(row.original.ID)}>
            Delete
          </Button>
        </ButtonGroup>
      )
    }
  ]

  return (
    <Container maxW="full">
      <NextSeo title="Admin Addresses List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/settings/adminaddresses/add`}>
          <Button variant="primaryButton">New Admin Address</Button>
        </Link>
        <HStack>
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <SearchDataTable tableData={addresses} columnsData={columnsData}></SearchDataTable>
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Admin Address to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected admin addresses to a CSV, once the export button is clicked behind the scenes a job
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
                  {loading ? <Spinner color="brand.500" /> : "Export Admin Addresses"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

const ProtectedAdminAddressesPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminAddressesPage />
    </ProtectedContent>
  )
}

export default ProtectedAdminAddressesPage
