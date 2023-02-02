import {Box, Button, ButtonGroup, HStack} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import Card from "lib/components/card/Card"
import Link from "lib/components/navigation/Link"
import React from "react"
import UserGroupsDataTable from "lib/components/datatable/datatable"
import {useRouter} from "next/router"
import {userGroupsService} from "lib/api"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"

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
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
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
      successToast({
        description: "Buyer deleted successfully."
      })
    } catch (e) {
      errorToast({
        description: "Buyer delete failed"
      })
    }
  }

  const columnsData = [
    {
      Header: "Name",
      accessor: "Name",
      Cell: ({value, row}) => (
        <Link href={`/buyers/${router.query.buyerid}/usergroups/${row.original.ID}`}>{value}</Link>
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
            onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups/${row.original.ID}`)}
          >
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteUserGroup(row.original.ID)}>
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
          <Button onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups/add`)} variant="primaryButton">
            Create user group
          </Button>
          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <UserGroupsDataTable tableData={userGroups} columnsData={columnsData} />
        </Card>
      </Box>
    </>
  )
}

export default UserGroupsList
