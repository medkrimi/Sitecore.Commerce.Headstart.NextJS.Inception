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
import {NextSeo} from "next-seo"
import React from "react"
import UserGroupsDataTable from "lib/components/datatable/datatable"
import {useRouter} from "next/router"
import {userGroupsService} from "lib/api"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "User groups List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UserGroupsList = () => {
  const [userGroups, setUserGroup] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initUserGroupsData(router.query.buyerid)
  }, [router.query.buyerid])

  async function initUserGroupsData(buyerid) {
    const userGroupsList = await userGroupsService.list(buyerid)
    setUserGroup(userGroupsList.Items)
  }

  async function deleteUserGroup(userGroupid) {
    try {
      await userGroupsService.delete(router.query.buyerid, userGroupid)
      initUserGroupsData(router.query.buyerid)
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
            onClick={() => deleteUserGroup(row.original.ID)}
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
      <Box padding="20px">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button
            onClick={() =>
              router.push(`/buyers/${router.query.buyerid}/usergroups/add`)
            }
            variant="primaryButton"
            leftIcon={<AddIcon />}
            size="lg"
          >
            Create user group
          </Button>
          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <UserGroupsDataTable
            tableData={userGroups}
            columnsData={columnsData}
          />
        </Card>
      </Box>
    </>
  )
}

export default UserGroupsList
