import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
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
import Link from "../../../../lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import {NextSeo} from "next-seo"
import React from "react"
import UsersDataTable from "../../../../lib/components/datatable/datatable"
import {dateHelper} from "../../../../lib/utils/date.utils"
import {useRouter} from "next/router"
import {usersService} from "../../../../lib/api"

const UserGroupsList = () => {
  const [users, setBuyers] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initUsersData()
  }, [])

  async function initUsersData() {
    const usersList = await usersService.list(router.query.buyerid)
    setBuyers(usersList.Items)
  }

  async function deleteBuyer(userGroupId) {
    try {
      await usersService.delete(router.query.buyerid, userGroupId)
      initUsersData()
      toast({
        id: id + "-deleted",
        title: "Success",
        description: "Buyer deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: id + "fail-deleted",
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
      accessor: "FirstName"
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
      accessor: "Active"
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button
            variant="secondaryButton"
            onClick={() => router.push(`/buyers/${row.original.ID}/`)}
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
    <Container maxW="full">
      <NextSeo title="Buyers" />
      <Heading as="h2" marginTop={5}>
        Users List
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Button
          onClick={() => router.push("#")}
          variant="primaryButton"
          leftIcon={<AddIcon />}
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
    </Container>
  )
}
export default UserGroupsList
