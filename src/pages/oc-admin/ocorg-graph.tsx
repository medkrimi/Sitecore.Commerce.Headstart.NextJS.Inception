import {Box, Button, ButtonGroup, Icon, Text, useToast} from "@chakra-ui/react"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
  buyersService,
  catalogsService,
  userGroupsService,
  usersService
} from "lib/api"
import {useEffect, useState} from "react"

import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import Link from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import TreeView from "lib/components/dndtreeview/TreeView"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import {ocNodeModel} from "@minoru/react-dnd-treeview"
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

const BuyersGraph = (props) => {
  const [marketplaceTreeView, setMarketplaceTreeView] = useState({})
  const [selectedNode, setSelectedNode] = useState<ocNodeModel>(null)

  const toast = useToast({
    duration: 6000,
    isClosable: true,
    position: "top"
  })

  useEffect(() => {
    initBuyersData()
  }, [])

  async function initBuyersData() {
    debugger
    let _ocOrgGraph = {}
    const buyersList = await buyersService.list()
    const requests = buyersList.Items.map(async (buyer) => {
      _ocOrgGraph[buyer.ID]["userGroups"] = []
      _ocOrgGraph[buyer.ID]["userGroups"] = await userGroupsService.list(
        buyer.ID
      )
      _ocOrgGraph[buyer.ID]["users"] = []
      _ocOrgGraph[buyer.ID]["users"] = await usersService.list(buyer.ID)
      _ocOrgGraph[buyer.ID]["catalogs"] = []
      _ocOrgGraph[buyer.ID]["catalogs"] =
        await catalogsService.getCatalogsbyBuyerID(buyer.ID)
    })
    await Promise.all(requests)
    setMarketplaceTreeView(await buildTreeView(_ocOrgGraph))
  }

  async function buildTreeView(ocOrgGraph: {}) {
    debugger
    let _ocTreeData = []
    for (const [buyerid, buyer] of Object.entries(ocOrgGraph)) {
      _ocTreeData.push(buildTreeNode(buyer, "OC", "buyer"))
      for (const [usergroupid, usergroup] of Object.entries(
        ocOrgGraph[buyerid]["userGroups"]
      )) {
        _ocTreeData.push(buildTreeNode(usergroup, buyerid, "usergroup"))
        for (const [userid, user] of Object.entries(
          ocOrgGraph[buyerid]["users"]
        )) {
          _ocTreeData.push(buildTreeNode(user, usergroupid, "user"))
        }
      }
    }
    console.log(_ocTreeData)
    return _ocTreeData
  }

  async function buildTreeNode(item, parentid, type) {
    return {
      id: item.ID,
      parent: parentid,
      text: item.Name + "(" + item.ID + ")",
      type: type,
      droppable: true,
      data: item
    }
  }
  const handleSelect = (node: ocNodeModel) => setSelectedNode(node)

  return (
    <>
      <TreeView
        treeData={marketplaceTreeView}
        selectedNode={selectedNode}
        handleSelect={handleSelect}
        {...props}
      />
    </>
  )
}

const ProtectedBuyersGraph = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <Card variant="primaryCard">
          <BuyersGraph props />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyersGraph
