import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Button, ButtonGroup, HStack} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"

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
        title: "All Catalogs",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
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
    initCatalogsData()
  }, [])

  async function initCatalogsData() {
    const catalogsList = await catalogsService.list()
    setCatalogs(catalogsList.Items)
  }

  async function deleteCatalog(catalogid) {
    try {
      await catalogsService.delete(catalogid)
      initCatalogsData()
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
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteCatalog(row.original.ID)} leftIcon={<DeleteIcon />}>
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
          onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups/add`)}
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
