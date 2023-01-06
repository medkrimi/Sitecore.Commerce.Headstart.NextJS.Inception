import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Heading,
  Icon,
  Text,
  useToast
} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import React from "react"
import UsersDataTable from "lib/components/datatable/datatable"
import {dateHelper} from "lib/utils/date.utils"
import {useRouter} from "next/router"
import {usersService} from "lib/api"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Users List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UsersList = () => {
  const [users, setBuyers] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initUsersData(router.query.buyerid)
  }, [router.query.buyerid])

  async function initUsersData(buyerid) {
    const usersList = await usersService.list(buyerid)
    setBuyers(usersList.Items)
  }

  async function deleteBuyer(userid) {
    try {
      await usersService.delete(router.query.buyerid, userid)
      initUsersData(router.query.buyerid)
      toast({
        id: userid + "-deleted",
        title: "Success",
        description: "Buyer deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: userid + "fail-deleted",
        title: "Error",
        description: "Buyer delete failed",
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
        <Link href={`/buyers/${router.query.buyerid}/users/${row.original.ID}`}>
          {value}
        </Link>
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
            onClick={() =>
              router.push(
                `/buyers/${router.query.buyerid}/users/${row.original.ID}`
              )
            }
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="secondaryButton"
            onClick={() => deleteBuyer(row.original.ID)}
            leftIcon={<DeleteIcon />}
          >
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
            onClick={() =>
              router.push(`/buyers/${router.query.buyerid}/users/add`)
            }
            variant="primaryButton"
            leftIcon={<AddIcon />}
            size="lg"
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
