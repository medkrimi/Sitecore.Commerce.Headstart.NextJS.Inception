import {Box, Button, ButtonGroup, HStack, Switch, Tooltip} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import Card from "lib/components/card/Card"
import CatalogsDataTable from "lib/components/datatable/datatable"
import Link from "lib/components/navigation/Link"
import React from "react"
import {catalogsService} from "lib/api"
import {useRouter} from "next/router"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"

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
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  useEffect(() => {
    initCatalogsData(router.query.buyerid)
  }, [router.query.buyerid])

  async function initCatalogsData(buyerid) {
    const catalogsList = await catalogsService.getCatalogsbyBuyerID(buyerid)
    setCatalogs(catalogsList.Items)
  }

  async function deleteCatalog(catalogid) {
    try {
      await catalogsService.delete(catalogid)
      initCatalogsData(router.query.buyerid)
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
      Header: "Catalog ID",
      accessor: "ID",
      Cell: ({value, row}) => <Link href={`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`}>{value}</Link>
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
        <Link href={`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}/categories`}>
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
            onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`)}
          >
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteCatalog(row.original.ID)}>
            Delete
          </Button>
        </ButtonGroup>
      )
    }
  ]

  return (
    <>
      <Box pl="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs/add`)} variant="primaryButton">
            Create catalog
          </Button>
          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <CatalogsDataTable tableData={catalogs} columnsData={columnsData} />
        </Card>
      </Box>
    </>
  )
}

export default CatalogsList
