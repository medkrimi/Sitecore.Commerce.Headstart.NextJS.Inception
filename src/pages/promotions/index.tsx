import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Badge, Box, Button, ButtonGroup, HStack, Icon, Stack, Text, useToast} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import PromotionsDataTable from "lib/components/datatable/datatable"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import {promotionsService} from "lib/api"
import router from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Promotions List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const PromotionsList = () => {
  const [promotions, setPromotions] = useState([])
  const toast = useToast({
    duration: 6000,
    isClosable: true,
    position: "top"
  })

  useEffect(() => {
    initPromotionsData()
  }, [])

  async function initPromotionsData() {
    const promotionsList = await promotionsService.list()
    setPromotions(promotionsList.Items)
  }

  async function deletePromotion(id) {
    try {
      await promotionsService.delete(id)
      initPromotionsData()
      toast({
        id: id + "-deleted",
        title: "Success",
        description: "Promotion deleted successfully.",
        status: "success"
      })
    } catch (e) {
      toast({
        id: id + "fail-deleted",
        title: "Error",
        description: "Promotion delete failed",
        status: "error"
      })
    }
  }

  const columnsData = [
    {
      Header: "Promotion ID",
      accessor: "ID",
      Cell: ({value, row}) => <Link href={`/promotions/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "Name",
      accessor: "Name",
      Cell: ({value, row}) => <Link href={`/buyers/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "Code",
      accessor: "Code"
    },
    {
      Header: "Line Item Level?",
      accessor: "LineItemLevel",
      Cell: ({value}) => (
        <>
          <Icon
            as={value === true ? MdCheck : IoMdClose}
            color={value === true ? "green.400" : "red.400"}
            w="20px"
            h="20px"
          />
        </>
      )
    },
    {
      Header: "Can combine?",
      accessor: "CanCombine",
      Cell: ({value}) => (
        <>
          <Icon
            as={value === true ? MdCheck : IoMdClose}
            color={value === true ? "green.400" : "red.400"}
            w="20px"
            h="20px"
          />
        </>
      )
    },
    {
      Header: "Allow All Buyers?",
      accessor: "AllowAllBuyers",
      Cell: ({value}) => (
        <>
          <Icon
            as={value === true ? MdCheck : IoMdClose}
            color={value === true ? "green.400" : "red.400"}
            w="20px"
            h="20px"
          />
        </>
      )
    },
    {
      Header: "Start Date",
      accessor: "StartDate",
      Cell: ({value}) => dateHelper.formatDate(value)
    },
    {
      Header: "Expiration Date",
      accessor: "Expiration Date",
      Cell: ({value}) => (value ? dateHelper.formatDate(value) : "No Expiration")
    },
    {
      Header: "Redemption Limit",
      Cell: ({row}) => (
        <>
          <Stack direction="row">
            <Badge colorScheme="green">{row.original.RedemptionLimit}</Badge>
            <Badge colorScheme="purpple">{row.original.RedemptionLimitPerUser}</Badge>
            <Badge colorScheme="gray">{row.original.RedemptionLimitCount}</Badge>
          </Stack>
        </>
      )
    },
    {
      Header: "ACTIONS",
      Cell: ({row}) => (
        <ButtonGroup>
          <Button
            variant="secondaryButton"
            onClick={() => router.push(`/promotions/${row.original.ID}/`)}
            leftIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button variant="secondaryButton" onClick={() => deletePromotion(row.original.ID)} leftIcon={<DeleteIcon />}>
            Delete
          </Button>
        </ButtonGroup>
      )
    }
  ]

  return (
    <>
      <PromotionsDataTable tableData={promotions} columnsData={columnsData} />
    </>
  )
}

const ProtectedBuyersList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button
            onClick={() => router.push(`/promotions/add`)}
            variant="primaryButton"
            leftIcon={<AddIcon />}
            size="lg"
          >
            Create promotion
          </Button>

          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <PromotionsList />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyersList
