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
import CategoriesDataTable from "lib/components/datatable/datatable"
import Link from "lib/components/navigation/Link"
import React from "react"
import {categoriesService} from "lib/api"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Categories List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CategoriesList = () => {
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const toast = useToast()
  useEffect(() => {
    initCategoriesData(router.query.catalogid)
  }, [router.query.catalogid])

  async function initCategoriesData(catalogid) {
    const categoriesList = await categoriesService.list(catalogid)
    console.log(catalogid)
    console.log(categoriesList.Items)
    setCategories(categoriesList.Items)
  }

  async function deleteCategory(categoryid) {
    try {
      await categoriesService.delete(router.query.catalogid, categoryid)
      initCategoriesData(router.query.buyerid)
      toast({
        id: categoryid + "-deleted",
        title: "Success",
        description: "Category deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: categoryid + "fail-deleted",
        title: "Error",
        description: "Category delete failed",
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
          href={`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories/${row.original.ID}`}
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
                `/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories/${row.original.ID}`
              )
            }
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="secondaryButton"
            onClick={() => deleteCategory(row.original.ID)}
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
              router.push(
                `/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories/add`
              )
            }
            variant="primaryButton"
            leftIcon={<AddIcon />}
            size="lg"
          >
            Create category
          </Button>
          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <CategoriesDataTable
            tableData={categories}
            columnsData={columnsData}
          />
        </Card>
      </Box>
    </>
  )
}

export default CategoriesList
