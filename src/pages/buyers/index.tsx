import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Text,
  useToast
} from "@chakra-ui/react"
import {
  buyersService,
  catalogsService,
  userGroupsService,
  usersService
} from "../../lib/api"
import {useEffect, useState} from "react"

import BuyersDataTable from "../../lib/components/datatable/datatable"
import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "../../lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "../../lib/utils/date.utils"
import router from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Buyers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const BuyersList = () => {
  const [buyers, setBuyers] = useState([])
  const [buyersMeta, setBuyersMeta] = useState({})

  const toast = useToast({
    duration: 6000,
    isClosable: true,
    position: "top"
  })

  useEffect(() => {
    initBuyersData()
  }, [])

  async function initBuyersData() {
    let _buyerListMeta = {}
    const buyersList = await buyersService.list()

    const requests = buyersList.Items.map(async (buyer) => {
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["userGroupsCount"] =
        await userGroupsService.getUserGroupsCountById(buyer.ID)
      _buyerListMeta[buyer.ID]["usersCount"] =
        await usersService.getUsersCountById(buyer.ID)
      _buyerListMeta[buyer.ID]["catalogsCount"] =
        await catalogsService.getCatalogsCountById(buyer.ID)
    })
    await Promise.all(requests)
    setBuyersMeta(_buyerListMeta)
    setBuyers(buyersList.Items)
  }

  async function deleteBuyer(id) {
    try {
      await buyersService.delete(id)
      initBuyersData()
      toast({
        id: id + "-deleted",
        title: "Success",
        description: "Buyer deleted successfully.",
        status: "success"
      })
    } catch (e) {
      toast({
        id: id + "fail-deleted",
        title: "Error",
        description: "Buyer delete failed",
        status: "error"
      })
    }
  }

  const columnsData = [
    {
      Header: "BUYER ID",
      accessor: "ID",
      Cell: ({value, row}) => (
        <Link href={`/buyers/${row.original.ID}`}>{value}</Link>
      )
    },
    {
      Header: "Name",
      accessor: "Name",
      Cell: ({value, row}) => (
        <Link href={`/buyers/${row.original.ID}`}>{value}</Link>
      )
    },
    {
      Header: "DEFAULT CATALOG ID",
      accessor: "DefaultCatalogID"
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
          <Button
            onClick={() => router.push(`/buyers/${row.original.ID}/usergroups`)}
            variant="secondaryButton"
          >
            User Groups ({buyersMeta[row.original.ID]["userGroupsCount"]})
          </Button>
          <Button
            onClick={() => router.push(`/buyers/${row.original.ID}/users`)}
            variant="secondaryButton"
          >
            Users ({buyersMeta[row.original.ID]["usersCount"]})
          </Button>
        </ButtonGroup>
      )
    },
    {
      Header: "CATALOGS",
      Cell: ({row}) => (
        <Link href={`/catalogs/${row.original.ID}/`}>
          <Button variant="secondaryButton">
            Manage Catalogs ({buyersMeta[row.original.ID]["usersCount"]})
          </Button>
        </Link>
      )
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
    <>
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Button
          onClick={() => router.push("/buyers/add")}
          variant="primaryButton"
          leftIcon={<AddIcon />}
          size="lg"
        >
          Create a new buyer
        </Button>
        <Button variant="secondaryButton">Export CSV</Button>
      </HStack>
      <Card variant="primaryCard">
        <BuyersDataTable tableData={buyers} columnsData={columnsData} />
      </Card>
    </>
  )
}

const ProtectedBuyersList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <BuyersList />
    </ProtectedContent>
  )
}

export default ProtectedBuyersList
