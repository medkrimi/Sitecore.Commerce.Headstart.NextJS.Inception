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

import BuyersDataTable from "../../lib/components/datatable/datatable"
import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "../../lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import {NextSeo} from "next-seo"
import React from "react"
import {buyersService} from "../../lib/api"
import {dateHelper} from "../../lib/utils/date.utils"
import router from "next/router"

const BuyersList = () => {
  const [buyers, setBuyers] = useState([])
  const [buyersMeta, setBuyersMeta] = useState({})
  const toast = useToast()
  useEffect(() => {
    initBuyersData()
  }, [])

  async function initBuyersData() {
    let _buyerListMeta = {}
    const buyersList = await buyersService.list()

    const requests = buyersList.Items.map(async (buyer) => {
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["usersCount"] =
        await buyersService.getUsersCountById(buyer.ID)
      _buyerListMeta[buyer.ID]["catalogsCount"] =
        await buyersService.getCatalogsCountById(buyer.ID)
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
      Header: "USERS",
      Cell: ({row}) => (
        <Link href={`/buyers/${row.original.ID}/users`}>
          <Button variant="secondaryButton">
            Manage Users ({buyersMeta[row.original.ID]["usersCount"]})
          </Button>
        </Link>
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
    <Container maxW="full">
      <NextSeo title="Buyers" />
      <Heading as="h2" marginTop={5}>
        Buyers List
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Button
          onClick={() => router.push("/buyers/add")}
          variant="primaryButton"
          leftIcon={<AddIcon />}
        >
          Create new buyer
        </Button>

        <HStack>
          <Button variant="secondaryButton">Export CSV</Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <BuyersDataTable tableData={buyers} columnsData={columnsData} />
      </Card>
    </Container>
  )
}
export default BuyersList
