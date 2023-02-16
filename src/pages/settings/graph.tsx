import {Box, Card} from "@chakra-ui/react"
import {Buyer, Supplier, User, UserGroup, MeSeller} from "ordercloud-javascript-sdk"
import {
  buyersService,
  catalogsService,
  suppliersService,
  supplierUserGroupsService,
  supplierUsersService,
  userGroupsService,
  usersService
} from "lib/api"
import {useEffect, useState} from "react"

import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import dynamic from "next/dynamic"

type Tree = {
  id?: string
  entityName?: string
  entityType?: "Seller" | "Supplier" | "Buyer" | "User" | "UserGroup"
  entityRelationship?: Array<Tree>
}

export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Marketplace Graph",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

async function buildNode(item, entityType) {
  let _ocGraphNode: Tree = {}
  _ocGraphNode.id = item.ID
  _ocGraphNode.entityName = item.Name
  _ocGraphNode.entityType = entityType
  _ocGraphNode.entityRelationship = await getUserGroups(item, entityType)
  return _ocGraphNode
}

async function getUsers(item, entityType) {
  let _users
  let _entityRelationship = []
  switch (entityType) {
    case "Buyer": {
      _users = await usersService.list(item.ID)
      break
    }
    case "Supplier": {
      _users = await supplierUsersService.list(item.ID)
      break
    }
    default: {
      return []
    }
  }
  _users.Items.forEach(async (i) => {
    _entityRelationship.push(await buildNode(i, "User"))
  })
  return _entityRelationship
}

async function getUserGroups(item, entityType) {
  let _userGroups
  let _entityRelationship = []
  switch (entityType) {
    case "Buyer": {
      _userGroups = await userGroupsService.list(item.ID)
      break
    }
    case "Supplier": {
      _userGroups = await supplierUserGroupsService.list(item.ID)
      break
    }
    default: {
      return []
    }
  }
  _userGroups.Items.forEach(async (i) => {
    _entityRelationship.push(await buildNode(i, "UserGroup"))
  })
  return _entityRelationship
}

async function buildMarketplaceGraphData() {
  let _ocGraph: Tree = {}
  _ocGraph.id = "Marketplace"
  _ocGraph.entityName = "SELLER - YOU"
  _ocGraph.entityType = "Seller"
  _ocGraph.entityRelationship = []

  //Get all buyers
  const buyersList = await buyersService.list()
  buyersList.Items.forEach(async (item) => {
    _ocGraph.entityRelationship.push(await buildNode(item, "Buyer"))
  })

  //Get all suppliers
  const supplierList = await suppliersService.list()
  supplierList.Items.forEach(async (item) => {
    _ocGraph.entityRelationship.push(await buildNode(item, "Supplier"))
  })

  return _ocGraph
}

const ProtectedGraph = () => {
  const [graphData, setGraphData] = useState<Tree | null>(null)

  useEffect(() => {
    initGraphData()
  }, [])

  async function initGraphData() {
    const graphData = await buildMarketplaceGraphData()
    setGraphData(graphData)
  }

  useEffect(() => {
    const buildGraphData = async () => {
      const _data = await buildMarketplaceGraphData()
      return _data
    }
    setGraphData(buildGraphData())
  }, [])

  // Temporary fix for this: https://github.com/daniel-hauser/react-organizational-chart/issues/45
  const MarketplaceGraph = dynamic(() => import("lib/components/graph/MarketplaceGraph", {ssr: false}))
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <Card variant="primaryCard">
          <MarketplaceGraph organization={graphData} />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedGraph
