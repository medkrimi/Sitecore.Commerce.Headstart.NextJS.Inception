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
import UserGroupsDataTable from "../../../../lib/components/datatable/datatable"
import {dateHelper} from "../../../../lib/utils/date.utils"
import {useRouter} from "next/router"
import {userGroupsService} from "../../../../lib/api"

const UserGroupsList = () => {
  const [userGroups, setBuyers] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initBuyersData()
  }, [])

  async function initBuyersData() {
    const userGroupsList = await userGroupsService.list(router.query.buyerid)
    setBuyers(userGroupsList.Items)
  }

  async function deleteBuyer(userGroupid) {
    try {
      await userGroupsService.delete(router.query.buyerid, userGroupid)
      initBuyersData()
      toast({
        id: userGroupid + "-deleted",
        title: "Success",
        description: "Buyer deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: userGroupid + "fail-deleted",
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
      Header: "Name",
      accessor: "Name",
      Cell: ({value, row}) => (
        <Link
          href={`/buyers/${router.query.buyerid}/usergroups/${row.original.ID}`}
        >
          {value}
        </Link>
      )
    },
    {
      Header: "DESCRIPTION",
      accessor: "Description"
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button
            variant="secondaryButton"
            onClick={() =>
              router.push(
                `/buyers/${router.query.buyerid}/usergroups/${row.original.ID}`
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
    <Container maxW="full">
      <NextSeo title="Buyers" />
      <Heading as="h2" marginTop={5}>
        User Groups List
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Button
          onClick={() =>
            router.push(`/buyers/${router.query.buyerid}/usergroups/add`)
          }
          variant="primaryButton"
          leftIcon={<AddIcon />}
        >
          Create user group
        </Button>
        <HStack>
          <Button variant="secondaryButton">Export CSV</Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <UserGroupsDataTable tableData={userGroups} columnsData={columnsData} />
      </Card>
    </Container>
  )
}
export default UserGroupsList
