import {Box, Button, ButtonGroup, HStack, Icon, Text, useToast} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import React from "react"
import UsersDataTable from "lib/components/datatable/datatable"
import {supplierUsersService} from "lib/api"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Users List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UsersList = () => {
  const [users, setSuppliers] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initUsersData(router.query.supplierid)
  }, [router.query.supplierid])

  async function initUsersData(supplierid) {
    const usersList = await supplierUsersService.list(supplierid)
    setSuppliers(usersList.Items)
  }

  async function deleteSupplier(userid) {
    try {
      await supplierUsersService.delete(router.query.supplierid, userid)
      initUsersData(router.query.supplierid)
      toast({
        id: userid + "-deleted",
        title: "Success",
        description: "Supplier deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: userid + "fail-deleted",
        title: "Error",
        description: "Supplier delete failed",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const columnsData = [
    {
      Header: "FirstName",
      accessor: "FirstName",
      Cell: ({value, row}) => (
        <Link href={`/suppliers/${router.query.supplierid}/users/${row.original.ID}`}>{value}</Link>
      )
    },
    {
      Header: "LastName",
      accessor: "LastName"
    },
    {
      Header: "Company ID",
      accessor: "CompanyID"
    },
    {
      Header: "Username",
      accessor: "Username"
    },
    {
      Header: "Email",
      accessor: "Email"
    },
    {
      Header: "Phone",
      accessor: "Phone"
    },
    {
      Header: "TermsAccepted",
      accessor: "TermsAccepted"
    },
    {
      Header: "Active",
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
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button
            variant="secondaryButton"
            onClick={() => router.push(`/suppliers/${router.query.supplierid}/users/${row.original.ID}`)}
          >
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
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button
            onClick={() => router.push(`/suppliers/${router.query.supplierid}/users/add`)}
            variant="primaryButton"
          >
            Create user
          </Button>

          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <UsersDataTable tableData={users} columnsData={columnsData} />
        </Card>
      </Box>
    </>
  )
}

export default UsersList
