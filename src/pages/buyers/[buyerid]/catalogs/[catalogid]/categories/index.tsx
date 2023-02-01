import {Box, Button, ButtonGroup, Grid, GridItem, HStack, Heading} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import Card from "lib/components/card/Card"
import Link from "lib/components/navigation/Link"
import ProtectedAddEditForm from "./add"
import ProtectedCategoryItem from "./[categoryid]"
import React from "react"
import TreeView from "lib/components/dndtreeview/TreeView"
import {categoriesService} from "lib/api"
import {ocNodeModel} from "@minoru/react-dnd-treeview"
import {useRouter} from "next/router"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Categories List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CategoriesList = (props) => {
  const [categories, setCategories] = useState([])
  const [categoriesTreeView, setCategoriesTreeView] = useState([])
  const [selectedNode, setSelectedNode] = useState<ocNodeModel>(null)
  const router = useRouter()
  const errorToast = useErrorToast()
  const successToast = useSuccessToast()
  useEffect(() => {
    initCategoriesData(router.query.catalogid)
  }, [router.query.catalogid])

  async function initCategoriesData(catalogid) {
    const categoriesList = await categoriesService.list(catalogid)
    setCategories(categoriesList.Items)
    setCategoriesTreeView(await buildTreeView(categoriesList.Items))
  }

  async function buildTreeView(treeData: any[]) {
    return treeData.map((item) => {
      return {
        id: item.ID,
        parent: item.ParentID ? item.ParentID : "-",
        text: item.Name,
        type: "category",
        droppable: true,
        data: item
      }
    })
  }
  const handleSelect = (node: ocNodeModel) => setSelectedNode(node)

  async function deleteCategory(categoryid) {
    try {
      await categoriesService.delete(router.query.catalogid, categoryid)
      initCategoriesData(router.query.buyerid)
      successToast({
        id: categoryid + "-deleted",
        title: "Success",
        description: "Category deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      errorToast({
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
        <Link href={`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories/${row.original.ID}`}>
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
          >
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deleteCategory(row.original.ID)}>
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
              router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories/add`)
            }
            variant="primaryButton"
          >
            Create category
          </Button>
          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <Grid
            templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
            gridTemplateRows={"auto 1fr 30px"}
            gridTemplateColumns={"auto 1fr"}
            h="auto"
            gap="1"
            color="blackAlpha.700"
            fontWeight="bold"
          >
            <GridItem pl="2" area={"header"}></GridItem>
            <GridItem pl="2" area={"nav"} width="300px">
              <TreeView
                treeData={categoriesTreeView}
                selectedNode={selectedNode}
                handleSelect={handleSelect}
                {...props}
              />
            </GridItem>
            <GridItem pl="2" area={"main"}>
              {selectedNode ? (
                <>
                  <Heading as="h5" size="md" noOfLines={1}>
                    Update the selected category
                  </Heading>
                  <ProtectedCategoryItem selectedNode={selectedNode} {...props} />
                </>
              ) : (
                <>
                  <Heading as="h5" size="md" noOfLines={1}>
                    Create new category
                  </Heading>
                  <ProtectedAddEditForm />
                </>
              )}
            </GridItem>
            <GridItem pl="2" area={"footer"}></GridItem>
          </Grid>
        </Card>
      </Box>
    </>
  )
}

export default CategoriesList
