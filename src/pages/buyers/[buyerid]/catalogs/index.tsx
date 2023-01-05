import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
  Button,
  ButtonGroup,
  HStack,
  Switch,
  Text,
  Tooltip,
  useToast
} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import Card from "lib/components/card/Card"
import CatalogsDataTable from "lib/components/datatable/datatable"
import Link from "lib/components/navigation/Link"
import React from "react"
import {catalogsService} from "lib/api"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Catalogs List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CatalogsList = () => {
  const [catalogs, setCatalogs] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initCatalogsData(router.query.buyerid)
  }, [router.query.buyerid])

  async function initCatalogsData(buyerid) {
    const catalogsList = await catalogsService.getCatalogsbyBuyerID(buyerid)
    console.log(catalogsList)
    setCatalogs(catalogsList.Items)
  }

  async function deleteCatalog(catalogid) {
    try {
      await catalogsService.delete(catalogid)
      initCatalogsData(router.query.buyerid)
      toast({
        id: catalogid + "-deleted",
        title: "Success",
        description: "Buyer deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: catalogid + "fail-deleted",
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
      Header: "Catalog ID",
      accessor: "ID",
      Cell: ({value, row}) => (
        <Link
          href={`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`}
        >
          {value}
        </Link>
      )
    },
    {
      Header: "Name",
      accessor: "Name"
    },
    {
      Header: "Description",
      accessor: "Description"
    },
    {
      Header: "Active",
      accessor: "Active",
      Cell: ({value, row}) => (
        <>
          <Tooltip label={value ? "Active" : "Non active"} placement="bottom">
            <Switch colorScheme="teal" size="lg" isReadOnly isChecked={value} />
          </Tooltip>
        </>
      )
    },
    {
      Header: "Category Count",
      accessor: "CategoryCount",
      Cell: ({row, value}) => (
        <Link
          href={`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}/categories`}
        >
          <Button variant="secondaryButton">Categories ({value})</Button>
        </Link>
      )
    },
    {
      Header: "Marketplace",
      accessor: "OwnerID"
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button
            variant="secondaryButton"
            onClick={() =>
              router.push(
                `/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`
              )
            }
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="secondaryButton"
            onClick={() => deleteCatalog(row.original.ID)}
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
          onClick={() =>
            router.push(`/buyers/${router.query.buyerid}/catalogs/add`)
          }
          variant="primaryButton"
          leftIcon={<AddIcon />}
          size="lg"
        >
          Create catalog
        </Button>
        <HStack>
          <Button variant="secondaryButton">Export CSV</Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <CatalogsDataTable tableData={catalogs} columnsData={columnsData} />
      </Card>
    </>
  )
}

export default CatalogsList