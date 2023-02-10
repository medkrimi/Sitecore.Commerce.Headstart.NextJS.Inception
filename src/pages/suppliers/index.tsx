import {Box, Button, ButtonGroup, HStack, Icon, Text, useToast} from "@chakra-ui/react"
import {supplierUserGroupsService, supplierUsersService, suppliersService} from "lib/api"
import {useEffect, useState} from "react"
import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import SuppliersDataTable from "lib/components/datatable/datatable"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import router from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Suppliers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([])
  const [suppliersMeta, setSuppliersMeta] = useState({})

  const toast = useToast({
    duration: 6000,
    isClosable: true,
    position: "top"
  })

  useEffect(() => {
    initSuppliersData()
  }, [])

  async function initSuppliersData() {
    let _supplierListMeta = {}
    const suppliersList = await suppliersService.list()

    const requests = suppliersList.Items.map(async (supplier) => {
      _supplierListMeta[supplier.ID] = {}
      _supplierListMeta[supplier.ID]["userGroupsCount"] = await supplierUserGroupsService.getSuppliersUserGroupsCount(
        supplier.ID
      )
      _supplierListMeta[supplier.ID]["usersCount"] = await supplierUsersService.getSuppliersUsersCount(supplier.ID)
    })
    await Promise.all(requests)
    setSuppliersMeta(_supplierListMeta)
    setSuppliers(suppliersList.Items)
  }

  async function deleteSupplier(id) {
    try {
      await suppliersService.delete(id)
      initSuppliersData()
      toast({
        id: id + "-deleted",
        title: "Success",
        description: "Supplier deleted successfully.",
        status: "success"
      })
    } catch (e) {
      toast({
        id: id + "fail-deleted",
        title: "Error",
        description: "Supplier delete failed",
        status: "error"
      })
    }
  }

  const columnsData = [
    {
      Header: "SUPPLIER ID",
      accessor: "ID",
      Cell: ({value, row}) => <Link href={`/suppliers/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "Name",
      accessor: "Name",
      Cell: ({value, row}) => <Link href={`/suppliers/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "STATUS",
      accessor: "Active",
      Cell: ({row}) => (
        <>
          <Icon
            as={row.original.Active === true ? MdCheck : IoMdClose}
            color={row.original.Active === true ? "green.400" : "red.400"}
            w="20px"
            h="20px"
          />
          <Text>{row.original.Active ? "Active" : "Non active"}</Text>
        </>
      )
    },
    {
      Header: "CREATED DATE",
      accessor: "DateCreated",
      Cell: ({value}) => dateHelper.formatDate(value)
    },
    {
      Header: "USER GROUPS / USERS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button onClick={() => router.push(`/suppliers/${row.original.ID}/usergroups`)} variant="secondaryButton">
            User Groups ({suppliersMeta[row.original.ID]["userGroupsCount"]})
          </Button>
          <Button onClick={() => router.push(`/suppliers/${row.original.ID}/users`)} variant="secondaryButton">
            Users ({suppliersMeta[row.original.ID]["usersCount"]})
          </Button>
        </ButtonGroup>
      )
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button variant="secondaryButton" onClick={() => router.push(`/suppliers/${row.original.ID}/`)}>
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteSupplier(row.original.ID)}>
            Delete
          </Button>
        </ButtonGroup>
      )
    }
  ]

  return (
    <>
      <SuppliersDataTable tableData={suppliers} columnsData={columnsData} />
    </>
  )
}

const ProtectedSuppliersList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/suppliers/add`)} variant="primaryButton">
            Create supplier
          </Button>

          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <SuppliersList />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedSuppliersList
